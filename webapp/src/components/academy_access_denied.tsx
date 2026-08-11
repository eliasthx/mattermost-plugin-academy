// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import './academy_access_denied.scss';

export default function AcademyAccessDenied() {
    return (
        <div className='AcademyAccessDenied'>
            <h2 className='AcademyAccessDenied__title'>{'Academy is unavailable'}</h2>
            <p className='AcademyAccessDenied__body'>
                {'You do not have access to Mattermost Academy. Contact your system administrator if you think this is a mistake.'}
            </p>
        </div>
    );
}
