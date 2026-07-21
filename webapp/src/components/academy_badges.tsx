// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import type {UserProfile} from '@mattermost/types/users';

import {GUIDES, guidePublicURL} from 'guides';
import {openLearning} from 'learning_state';
import manifest from 'manifest';

import './academy_badges.scss';

type Completion = {
    guideId: string;
    completedAt: number;
};

type Props = {
    user?: UserProfile;
    hide?: () => void;
};

const MATERIAL_SYMBOLS_HREF =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';

const MATERIAL_SYMBOLS_ID = 'mm-academy-material-symbols';

function ensureMaterialSymbolsFont() {
    if (document.getElementById(MATERIAL_SYMBOLS_ID)) {
        return;
    }
    const link = document.createElement('link');
    link.id = MATERIAL_SYMBOLS_ID;
    link.rel = 'stylesheet';
    link.href = MATERIAL_SYMBOLS_HREF;
    document.head.appendChild(link);
}

function formatCompletedAt(unixSeconds: number): string {
    if (!unixSeconds) {
        return '';
    }
    return new Date(unixSeconds * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

const BADGE_SEAL_URL = `/plugins/${manifest.id}/public/Badge.svg`;

/**
 * Profile popover attributes: one icon per completed Academy guide.
 * Styled tooltip shows guide name + completion date; click opens the guide.
 */
export default function AcademyBadges(props: Props) {
    const userId = props.user?.id;
    const [badgesEnabled, setBadgesEnabled] = useState<boolean | null>(null);
    const [completions, setCompletions] = useState<Completion[] | null>(null);

    useEffect(() => {
        ensureMaterialSymbolsFont();
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch(
                    `/plugins/${manifest.id}/api/v1/settings`,
                    {
                        credentials: 'same-origin',
                        headers: {'X-Requested-With': 'XMLHttpRequest'},
                    },
                );
                if (!res.ok) {
                    throw new Error('failed to load settings');
                }
                const data = await res.json();
                if (!cancelled) {
                    setBadgesEnabled(data.enableProfileBadges !== false);
                }
            } catch {
                if (!cancelled) {
                    // Fail open so completions still show if settings are unavailable.
                    setBadgesEnabled(true);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!userId || badgesEnabled !== true) {
            setCompletions([]);
            return undefined;
        }

        let cancelled = false;
        setCompletions(null);

        (async () => {
            try {
                const res = await fetch(
                    `/plugins/${manifest.id}/api/v1/users/${encodeURIComponent(userId)}/completions`,
                    {
                        credentials: 'same-origin',
                        headers: {'X-Requested-With': 'XMLHttpRequest'},
                    },
                );
                if (!res.ok) {
                    throw new Error('failed to load completions');
                }
                const data = await res.json();
                if (!cancelled) {
                    setCompletions(Array.isArray(data.completions) ? data.completions : []);
                }
            } catch {
                if (!cancelled) {
                    setCompletions([]);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId, badgesEnabled]);

    if (badgesEnabled === false || !completions || completions.length === 0) {
        return null;
    }

    const badges = completions.map((c) => {
        const meta = GUIDES[c.guideId];
        if (!meta) {
            return null;
        }
        const dateLabel = formatCompletedAt(c.completedAt);
        const tooltip = (
            <Tooltip
                id={`academy-badge-${c.guideId}`}
                className='AcademyBadges__tooltip-root'
            >
                <div className='AcademyBadges__tooltip'>
                    <div>{meta.title}</div>
                    {dateLabel && <div>{`Completed ${dateLabel}`}</div>}
                </div>
            </Tooltip>
        );

        return (
            <OverlayTrigger
                key={c.guideId}
                delayShow={400}
                placement='top'
                overlay={tooltip}
            >
                <button
                    type='button'
                    className='AcademyBadges__badge'
                    role='listitem'
                    aria-label={`${meta.title}${dateLabel ? `, completed ${dateLabel}` : ''}. Open guide.`}
                    onClick={() => {
                        props.hide?.();
                        openLearning(guidePublicURL(meta.file));
                    }}
                >
                    <img
                        className='AcademyBadges__seal'
                        src={BADGE_SEAL_URL}
                        alt=''
                        draggable={false}
                    />
                    <span className='material-symbols-outlined AcademyBadges__icon' aria-hidden={true}>
                        {meta.icon}
                    </span>
                </button>
            </OverlayTrigger>
        );
    }).filter((badge): badge is React.ReactElement => Boolean(badge));

    if (badges.length === 0) {
        return null;
    }

    return (
        <div className='AcademyBadges'>
            <strong className='user-popover__subtitle AcademyBadges__heading'>Academy Badges</strong>
            <div className='AcademyBadges__row' role='list' aria-label='Mattermost Academy badges'>
                {badges}
            </div>
        </div>
    );
}
