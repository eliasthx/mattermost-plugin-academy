// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from 'manifest';
import {navigateToAcademy} from 'navigation';
import React from 'react';
import type {Store} from 'redux';

import type {GlobalState} from '@mattermost/types/store';

import AcademyBadges from 'components/academy_badges';
import AcademyHelpMenuItem from 'components/academy_help_menu_item';
import AdminGuideCompletionsSection from 'components/admin_guide_completions_section';
import AdminProfileBadgesSection from 'components/admin_profile_badges_section';
import App from 'components/app';
import {AcademyProductIcon, ACADEMY_ICON_URL} from 'components/icons';
import LearnIcon from 'components/learn_icon';

import type {PluginRegistry} from 'types/mattermost-webapp';

export default class Plugin {
    // store reserved for future product↔channels integration
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async initialize(registry: PluginRegistry, _store: Store<GlobalState>) {
        registry.registerProduct(
            '/academy',
            <AcademyProductIcon/>,
            'Academy',
            '/academy',
            App,
            () => null,
            () => null,
            false,
        );

        if (registry.registerAppBarComponent) {
            registry.registerAppBarComponent(
                ACADEMY_ICON_URL,
                () => navigateToAcademy(),
                'Mattermost Academy',
                null as never,
            );
        }

        registry.registerChannelHeaderButtonAction(
            <LearnIcon/>,
            () => navigateToAcademy(),
            'Mattermost Academy',
            'Mattermost Academy',
        );

        registry.registerPopoverUserAttributesComponent(AcademyBadges);

        registry.registerAdminConsoleCustomSection('ProfileBadges', AdminProfileBadgesSection);
        registry.registerAdminConsoleCustomSection('GuideCompletions', AdminGuideCompletionsSection);

        registry.registerUserGuideDropdownMenuAction(
            <AcademyHelpMenuItem/>,
            () => navigateToAcademy(),
        );
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void;
    }
}

window.registerPlugin(manifest.id, new Plugin());
