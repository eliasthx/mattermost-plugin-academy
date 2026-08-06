// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Tooltip} from 'react-bootstrap';

import './academy_badges.scss';

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
