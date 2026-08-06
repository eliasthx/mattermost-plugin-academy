// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {AcademyProductIcon} from 'components/icons';

import './academy_help_menu_item.scss';

/**
 * Label for the ? help menu. Mattermost hardcodes icon-thumbs-up-down for
 * plugin items, so we hide that and render the Academy icon here.
 */
export default function AcademyHelpMenuItem() {
    return (
        <span className='AcademyHelpMenuItem'>
            <span
                className='AcademyHelpMenuItem__icon'
                aria-hidden={true}
            >
                <AcademyProductIcon size={16}/>
            </span>
            {'Mattermost Academy'}
        </span>
    );
}
