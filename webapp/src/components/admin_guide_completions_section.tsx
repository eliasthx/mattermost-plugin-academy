// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import AdminCompletionsChart from './admin_completions_chart';

type Props = {
    sectionTitle?: string;
    settingsList?: React.ReactNode[];
};

/**
 * Uses Mattermost System Console config-section markup/classes
 * (same structure SettingsGroup renders for Calls-style panes).
 * Plugins cannot import SettingsGroup itself; CSS is provided by the host.
 */
export default function GuideCompletionsSection(props: Props) {
    const title = props.sectionTitle || 'Guide completions';

    return (
        <div className='config-section'>
            <div className='admin-console__wrapper'>
                <div className='admin-console__content'>
                    <div className='section-header'>
                        <div className='section-title'>{title}</div>
                        <div className='section-subtitle'>
                            {'See how many users finish Academy guides over time, filter by guide, and export results'}
                        </div>
                    </div>
                    <div className='section-body'>
                        <AdminCompletionsChart/>
                        {props.settingsList}
                    </div>
                </div>
            </div>
        </div>
    );
}
