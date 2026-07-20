// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useEffect, useState} from 'react';

import manifest from 'manifest';

import {isLearningOpen, subscribeLearning} from 'learning_state';

/**
 * Book icon for the Learn control (channel header / app bar).
 * Applies Mattermost's App Bar active styles while Learning is open.
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
        <i
            className={active ? 'icon fa fa-book app-bar__old-icon--active' : 'icon fa fa-book'}
            style={active ? {color: 'rgba(var(--sidebar-text-rgb), 1)'} : undefined}
        />
    );
}
