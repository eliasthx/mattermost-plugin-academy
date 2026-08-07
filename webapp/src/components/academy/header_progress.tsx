// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type HeaderProgressProps = {
    done: number;
    total: number;
    label: string;
};

/** Progress chip + gold bar for academy headers (catalog, guide, RHS). */
export default function HeaderProgress({done, total, label}: HeaderProgressProps) {
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    return (
        <div
            className='academy-header__progress'
            role='status'
            aria-label={label}
        >
            <span className='academy-header__progress-label'>{label}</span>
            <div
                className='academy-header__progress-track'
                aria-hidden={true}
            >
                <div
                    className='academy-header__progress-bar'
                    style={{width: `${pct}%`}}
                />
            </div>
        </div>
    );
}
