// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';

import manifest from 'manifest';

import {isLearningOpen, subscribeLearning} from 'learning_state';

const ICON_URL = `/plugins/${manifest.id}/public/academy-icon.png`;

/**
 * Same pattern as Agents: 24×24 circular <img> fills the App Bar circle.
 */
export default function LearnIcon() {
    const [, setTick] = useState(0);

    useEffect(() => subscribeLearning(() => setTick((n) => n + 1)), []);

    const active = isLearningOpen();

    useEffect(() => {
        const appBarIcon = document.getElementById(`app-bar-icon-${manifest.id}`);
        if (!appBarIcon) {
            return undefined;
        }

        appBarIcon.classList.toggle('app-bar__icon--active', active);
        return () => {
            appBarIcon.classList.remove('app-bar__icon--active');
        };
    }, [active]);

    return (
        <img
            src={ICON_URL}
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
