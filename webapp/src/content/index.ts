// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import aiQuickStart from 'content/guides/ai_quick_start';
import slashCommands from 'content/guides/slash_commands';
import type {Guide} from 'content/types';
import manifest from 'manifest';

export type {Guide, Module, Audience, Step} from 'content/types';

export const ACADEMY_BASE_PATH = '/academy';

export const GUIDES: Record<string, Guide> = {
    [aiQuickStart.id]: aiQuickStart,
    [slashCommands.id]: slashCommands,
};

export const GUIDE_LIST: Guide[] = Object.values(GUIDES);

export function getGuide(guideId: string): Guide | undefined {
    return GUIDES[guideId];
}

export function guideAssetURL(guideId: string, file: string) {
    return `/plugins/${manifest.id}/public/guides/assets/${guideId}/${file}`;
}

export function badgeSealURL() {
    return `/plugins/${manifest.id}/public/Badge.svg`;
}

/** Absolute browser URL path (for window.location / markdown links). */
export function academyPath(path = '') {
    if (!path || path === '/') {
        return ACADEMY_BASE_PATH;
    }
    return `${ACADEMY_BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

/** React Router paths (relative to basename `/academy`). */
export const routes = {
    catalog: '/',
    guide: (guideId: string) => `/guides/${guideId}`,
    module: (guideId: string, moduleId: string) => `/guides/${guideId}/modules/${moduleId}`,
    done: (guideId: string) => `/guides/${guideId}/done`,
};

export function guidePath(guideId: string) {
    return academyPath(routes.guide(guideId));
}

export function modulePath(guideId: string, moduleId: string) {
    return academyPath(routes.module(guideId, moduleId));
}

export function donePath(guideId: string) {
    return academyPath(routes.done(guideId));
}
