// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';

import manifest from 'manifest';

import {isLearningOpen, openLearning, subscribeLearning} from 'learning_state';

const MODULE_PATH = `/plugins/${manifest.id}/public/modules/ai-quick-start.html`;

// Below menus (1100), modals (1050), popovers (1200), and global header (99).
// Above normal channel content and the RHS (~12–20) so --elevation-1 can cast
// onto the RHS edge the same way native #channel_view does. Bounds are clamped
// to the RHS left edge so we never cover RHS content.
const OVERLAY_Z_INDEX = 50;

type Bounds = {
    top: number;
    left: number;
    width: number;
    height: number;
};

const iframeStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    minHeight: 0,
};

function isElementVisible(el: HTMLElement | null): el is HTMLElement {
    if (!el || el.style.display === 'none') {
        return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
}

function getRhsLeftEdge(): number | null {
    const rhs = document.getElementById('sidebar-right');
    if (isElementVisible(rhs)) {
        return rhs.getBoundingClientRect().left;
    }

    const holder = document.querySelector('.sidebar--right--width-holder') as HTMLElement | null;
    if (isElementVisible(holder)) {
        return holder.getBoundingClientRect().left;
    }

    return null;
}

function isResizeEventTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) {
        return false;
    }
    if (target.closest('[class*="resize"], [class*="Resizable"], .sidebar--right--width-holder')) {
        return true;
    }
    return window.getComputedStyle(target).cursor === 'col-resize';
}

/**
 * Cover sidebar + center only — never the RHS.
 */
function measureGuideBounds(): Bounds | null {
    const center = document.getElementById('channel_view');
    if (!center) {
        return null;
    }

    const centerRect = center.getBoundingClientRect();
    const sidebar = document.getElementById('SidebarContainer');

    let top = centerRect.top;
    let left = centerRect.left;
    let right = centerRect.right;
    let bottom = centerRect.bottom;

    if (isElementVisible(sidebar)) {
        const sidebarRect = sidebar.getBoundingClientRect();
        left = Math.min(sidebarRect.left, left);
        top = Math.min(sidebarRect.top, top);
        right = Math.max(sidebarRect.right, right);
        bottom = Math.max(sidebarRect.bottom, bottom);
    }

    const rhsLeft = getRhsLeftEdge();
    if (rhsLeft !== null) {
        right = Math.min(right, rhsLeft);
    }

    return {
        top,
        left,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top),
    };
}

/**
 * Covers the channel sidebar + center panel while Learning is open.
 * Menus, popovers, modals, and RHS stack above this overlay.
 */
export default function LearningOverlay() {
    const [, setTick] = useState(0);
    const [bounds, setBounds] = useState<Bounds | null>(null);
    const [resizingRhs, setResizingRhs] = useState(false);
    const [rhsOpen, setRhsOpen] = useState(false);

    useEffect(() => subscribeLearning(() => setTick((n) => n + 1)), []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('learn') === '1') {
            openLearning();
        }
    }, []);

    const open = isLearningOpen();

    useEffect(() => {
        if (!open) {
            setBounds(null);
            setResizingRhs(false);
            setRhsOpen(false);
            return undefined;
        }

        const sidebar = document.getElementById('SidebarContainer');
        const previousDisplay = sidebar?.style.display ?? '';
        if (sidebar) {
            sidebar.style.display = 'none';
        }

        const rhs = document.getElementById('sidebar-right');

        let frame1 = 0;
        let frame2 = 0;
        let pendingFrame = 0;
        const updateBounds = () => {
            // Coalesce ResizeObserver spam (especially during RHS drag) to one update per frame.
            if (pendingFrame) {
                return;
            }
            pendingFrame = window.requestAnimationFrame(() => {
                pendingFrame = 0;
                setRhsOpen(getRhsLeftEdge() !== null);
                setBounds(measureGuideBounds());
            });
        };

        frame1 = window.requestAnimationFrame(() => {
            updateBounds();
            frame2 = window.requestAnimationFrame(updateBounds);
        });
        window.addEventListener('resize', updateBounds);

        const onMouseDown = (event: MouseEvent) => {
            if (isResizeEventTarget(event.target)) {
                setResizingRhs(true);
            }
        };
        const onMouseUp = () => {
            setResizingRhs(false);
            updateBounds();
        };
        window.addEventListener('mousedown', onMouseDown, true);
        window.addEventListener('mouseup', onMouseUp, true);

        const center = document.getElementById('channel_view');
        const main = document.querySelector('.main-wrapper');
        const holder = document.querySelector('.sidebar--right--width-holder');
        const root = document.getElementById('root') ?? document.body;
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateBounds);
        if (observer) {
            if (center) {
                observer.observe(center);
            }
            if (main) {
                observer.observe(main);
            }
            if (rhs) {
                observer.observe(rhs);
            }
            if (holder) {
                observer.observe(holder);
            }
        }

        const mutationObserver = new MutationObserver(updateBounds);
        mutationObserver.observe(root, {attributes: true, attributeFilter: ['class']});
        if (root !== document.body) {
            mutationObserver.observe(document.body, {attributes: true, attributeFilter: ['class']});
        }

        return () => {
            window.cancelAnimationFrame(frame1);
            window.cancelAnimationFrame(frame2);
            if (pendingFrame) {
                window.cancelAnimationFrame(pendingFrame);
            }
            window.removeEventListener('resize', updateBounds);
            window.removeEventListener('mousedown', onMouseDown, true);
            window.removeEventListener('mouseup', onMouseUp, true);
            observer?.disconnect();
            mutationObserver.disconnect();
            if (sidebar) {
                sidebar.style.display = previousDisplay;
            }
        };
    }, [open]);

    if (!open || !bounds || bounds.width <= 0 || bounds.height <= 0) {
        return null;
    }

    // When RHS is open, square off the right edge; keep left corners rounded.
    // Shadow lives on the outer shell so overflow clipping on the inner shell
    // does not hide Mattermost's elevation (same token as #channel_view).
    const borderRadius = rhsOpen
        ? 'var(--radius-l, 12px) 0 0 var(--radius-l, 12px)'
        : 'var(--radius-l, 12px)';

    return (
        <div
            className='MattermostAcademyOverlay'
            style={{
                position: 'fixed',
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height,
                zIndex: OVERLAY_Z_INDEX,
                borderRadius,
                background: 'var(--center-channel-bg, #fff)',
                boxShadow: 'var(--elevation-1, 0 2px 3px 0 rgba(0, 0, 0, 0.08))',
                // While dragging the RHS, let mouse events pass through so the
                // resize isn't stolen by this overlay / iframe.
                pointerEvents: resizingRhs ? 'none' : 'auto',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: 'inherit',
                }}
            >
                <iframe
                    title='Mattermost Academy'
                    src={MODULE_PATH}
                    style={iframeStyle}
                    allow='clipboard-write'
                />
            </div>
        </div>
    );
}
