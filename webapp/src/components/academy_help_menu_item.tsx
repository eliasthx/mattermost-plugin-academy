// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './academy_help_menu_item.scss';

/**
 * Label for the ? help menu. Mattermost hardcodes icon-thumbs-up-down for
 * plugin items, so we hide that and render a matching outline grad cap here.
 */
export default function AcademyHelpMenuItem() {
    return (
        <span className='AcademyHelpMenuItem'>
            <span
                className='AcademyHelpMenuItem__icon'
                aria-hidden={true}
            >
                <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M12 3L1 9l11 6 9-4.91V17h2V9L12 3z'
                        fill='currentColor'
                    />
                    <path
                        d='M5 13.18v4.32C5 19.8 8.13 21 12 21s7-1.2 7-3.5v-4.32l-7 3.82-7-3.82z'
                        fill='currentColor'
                    />
                </svg>
            </span>
            {'Mattermost Academy'}
        </span>
    );
}
