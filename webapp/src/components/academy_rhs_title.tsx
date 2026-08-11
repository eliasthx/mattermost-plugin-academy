// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {ACADEMY_ICON_URL} from 'components/icons';

/** Title for the host RHS chrome — icon + label. */
export default function AcademyRHSTitle() {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
            }}
        >
            <img
                src={ACADEMY_ICON_URL}
                alt=''
                width={20}
                height={20}
                draggable={false}
                style={{
                    display: 'block',
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    objectFit: 'cover',
                }}
            />
            {'Academy'}
        </span>
    );
}
