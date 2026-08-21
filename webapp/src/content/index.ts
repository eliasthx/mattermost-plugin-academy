// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import aiQuickStart from 'content/guides/ai_quick_start';
import slashCommands from 'content/guides/slash_commands';
import type {Guide, Module} from 'content/types';
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

/**
 * A null `activePluginIDs` means the server could not determine what is
 * running, so nothing is filtered. An empty array means nothing is active.
 */
export function meetsPluginRequirements(
    requiresPlugins: string[] | undefined,
    activePluginIDs: string[] | null,
): boolean {
    if (!requiresPlugins || requiresPlugins.length === 0) {
        return true;
    }
    if (activePluginIDs === null) {
        return true;
    }
    return requiresPlugins.every((id) => activePluginIDs.includes(id));
}

export function visibleModules(guide: Guide, activePluginIDs: string[] | null): Module[] {
    return guide.modules.filter((mod) => meetsPluginRequirements(mod.requiresPlugins, activePluginIDs));
}

/**
 * Returns the guide with unavailable modules removed, or undefined when the
 * guide itself is unavailable or has nothing left to show.
 */
export function resolveGuide(guide: Guide, activePluginIDs: string[] | null): Guide | undefined {
    if (!meetsPluginRequirements(guide.requiresPlugins, activePluginIDs)) {
        return undefined;
    }
    const modules = visibleModules(guide, activePluginIDs);
    if (modules.length === 0) {
        return undefined;
    }
    if (modules.length === guide.modules.length) {
        return guide;
    }
    return {...guide, modules};
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
