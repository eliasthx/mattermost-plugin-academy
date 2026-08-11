// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './admin_panel.scss';
import './admin_user_access_section.scss';

type Props = {
    sectionTitle?: string;
    sectionSubtitle?: string;
    settingsList?: React.ReactNode[];
};

/**
 * System Console Access section (users + guides).
 * Panel chrome matches Agents System Console panels.
 */
export default function AdminUserAccessSection(props: Props) {
    const title = props.sectionTitle || 'Access';
    const subtitle = props.sectionSubtitle ||
        'Control who can use Academy and which guides are available. Users who are not allowed will not see Academy in the product interface.';

    return (
        <div className='AcademyAdminPanel AcademyUserAccessSection'>
            <div className='AcademyAdminPanel__header'>
                <div className='AcademyAdminPanel__title'>{title}</div>
                <div className='AcademyAdminPanel__subtitle'>{subtitle}</div>
            </div>
            <div className='AcademyAdminPanel__body'>
                {props.settingsList}
            </div>
        </div>
    );
}
