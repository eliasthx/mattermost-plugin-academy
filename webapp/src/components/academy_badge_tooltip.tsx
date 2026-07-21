// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';
import {Overlay, Tooltip} from 'react-bootstrap';

import './academy_badges.scss';

export const BADGE_TOOLTIP_SHOW = 'mm-academy-badge-tooltip-show';
export const BADGE_TOOLTIP_HIDE = 'mm-academy-badge-tooltip-hide';

type AnchorRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export function formatBadgeEarnedAt(unixSeconds: number): string {
    if (!unixSeconds) {
        return '';
    }
    return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

type TooltipBodyProps = {
    id: string;
    title: string;
    dateLabel?: string;
} & Omit<React.ComponentProps<typeof Tooltip>, 'id' | 'children'>;

/** Shared Mattermost/react-bootstrap tooltip used for Academy badges. */
export function AcademyBadgeTooltip({id, title, dateLabel, className, ...rest}: TooltipBodyProps) {
    // Overlay / OverlayTrigger inject placement + position styles — must forward them.
    return (
        <Tooltip
            id={id}
            className={['AcademyBadges__tooltip-root', className].filter(Boolean).join(' ')}
            {...rest}
        >
            <div className='AcademyBadges__tooltip'>
                <div>{title}</div>
                {dateLabel ? <div>{`Earned ${dateLabel}`}</div> : null}
            </div>
        </Tooltip>
    );
}

type HostProps = {
    iframeRef: React.RefObject<HTMLIFrameElement | null>;
    resetKey?: string;
};

/**
 * Renders the same badge tooltip as the profile popover when a guide iframe
 * asks the parent to show it (guides can't use React Bootstrap themselves).
 */
export function AcademyGuideBadgeTooltipHost(props: HostProps) {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState('');
    const [dateLabel, setDateLabel] = useState('');
    const [anchorBox, setAnchorBox] = useState<AnchorRect | null>(null);
    const [target, setTarget] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        setShow(false);
    }, [props.resetKey]);

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) {
                return;
            }
            const data = event.data;
            if (!data || typeof data !== 'object') {
                return;
            }
            if (data.type === BADGE_TOOLTIP_HIDE) {
                setShow(false);
                return;
            }
            if (data.type !== BADGE_TOOLTIP_SHOW) {
                return;
            }

            const iframe = props.iframeRef.current;
            const rect = data.rect as AnchorRect | undefined;
            if (!iframe || !rect) {
                return;
            }

            const frameRect = iframe.getBoundingClientRect();
            setTitle(typeof data.title === 'string' ? data.title : '');
            setDateLabel(typeof data.dateLabel === 'string' ? data.dateLabel : '');
            setAnchorBox({
                top: frameRect.top + rect.top,
                left: frameRect.left + rect.left,
                width: rect.width,
                height: rect.height,
            });
            setShow(true);
        };

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [props.iframeRef]);

    return (
        <>
            {anchorBox && (
                <div
                    ref={setTarget}
                    style={{
                        position: 'fixed',
                        top: anchorBox.top,
                        left: anchorBox.left,
                        width: anchorBox.width,
                        height: anchorBox.height,
                        pointerEvents: 'none',
                    }}
                />
            )}
            <Overlay
                show={show && Boolean(target)}
                placement='top'
                target={target}
                container={document.body}
            >
                <AcademyBadgeTooltip
                    id='academy-guide-badge-tooltip'
                    title={title}
                    dateLabel={dateLabel || undefined}
                />
            </Overlay>
        </>
    );
}
