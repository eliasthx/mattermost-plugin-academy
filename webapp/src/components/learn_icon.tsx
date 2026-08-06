// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {ACADEMY_ICON_URL} from 'components/icons';

/**
 * Same pattern as Agents: 24×24 circular <img> fills the App Bar / channel header circle.
 */
export default function LearnIcon() {
    return (
        <img
            src={ACADEMY_ICON_URL}
            alt=''
            width={24}
            height={24}
            style={{
                display: 'block',
                width: 24,
                height: 24,
                borderRadius: '50%',
            }}
        />
    );
}
