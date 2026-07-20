// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import type {Store} from 'redux';

import type {GlobalState} from '@mattermost/types/store';

import AdminGuideCompletionsSection from 'components/admin_guide_completions_section';
import AdminProfileBadgesSection from 'components/admin_profile_badges_section';
import AcademyBadges from 'components/academy_badges';
import LearningOverlay from 'components/learning_overlay';
import LearnIcon from 'components/learn_icon';
import manifest from 'manifest';

import {toggleLearning} from 'learning_state';

import type {PluginRegistry} from 'types/mattermost-webapp';

export default class Plugin {
    public async initialize(registry: PluginRegistry, _store: Store<GlobalState>) {
        // RootComponent hosts the overlay; when open it expands over sidebar + center.
        registry.registerRootComponent(LearningOverlay);

        registry.registerPopoverUserAttributesComponent(AcademyBadges);

        registry.registerAdminConsoleCustomSection('ProfileBadges', AdminProfileBadgesSection);
        registry.registerAdminConsoleCustomSection('GuideCompletions', AdminGuideCompletionsSection);

        registry.registerChannelHeaderButtonAction(
            <LearnIcon/>,
            () => toggleLearning(),
            'Mattermost Academy',
            'Mattermost Academy',
        );
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void;
    }
}

window.registerPlugin(manifest.id, new Plugin());
