// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ACADEMY_BASE_PATH, academyPath, guidePath, modulePath} from 'content';

/** Navigate into the Academy product (full-screen). */
export function navigateToAcademy(path = '') {
    window.location.href = academyPath(path);
}

export function navigateToGuide(guideId: string) {
    window.location.href = guidePath(guideId);
}

export function navigateToModule(guideId: string, moduleId: string) {
    window.location.href = modulePath(guideId, moduleId);
}

export function isAcademyLocation(pathname = window.location.pathname) {
    return pathname === ACADEMY_BASE_PATH || pathname.startsWith(`${ACADEMY_BASE_PATH}/`);
}
