// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ACADEMY_BASE_PATH, academyPath, guidePath, modulePath} from 'content';

type BrowserHistory = {
    push: (path: string) => void;
};

declare global {
    interface Window {
        WebappUtils?: {
            browserHistory?: BrowserHistory;
        };
    }
}

/** Client-side product navigation when available; avoids a full webapp reload. */
function navigate(path: string) {
    const history = window.WebappUtils?.browserHistory;
    if (history?.push) {
        history.push(path);
        return;
    }
    window.location.assign(path);
}

/** Navigate into the Academy product (full-screen). */
export function navigateToAcademy(path = '') {
    navigate(academyPath(path));
}

/** Leave Academy for the Channels product. */
export function navigateToChannels() {
    navigate('/');
}

export function navigateToGuide(guideId: string) {
    navigate(guidePath(guideId));
}

export function navigateToModule(guideId: string, moduleId: string) {
    navigate(modulePath(guideId, moduleId));
}

export function isAcademyLocation(pathname = window.location.pathname) {
    return pathname === ACADEMY_BASE_PATH || pathname.startsWith(`${ACADEMY_BASE_PATH}/`);
}
