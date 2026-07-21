// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from 'manifest';

/** Bump when guide HTML changes so iframe navigations skip stale browser cache. */
export const GUIDE_ASSET_VERSION = '7';

/** Catalog metadata for Academy guides (icons match guide-browser.html). */
export type GuideMeta = {
    title: string;
    /** Material Symbols Outlined ligature name used on the guide card. */
    icon: string;
    /** Guide HTML filename under public/guides/. */
    file: string;
};

export const GUIDES: Record<string, GuideMeta> = {
    'ai-quick-start': {
        title: 'AI Quick Start',
        icon: 'smart_toy',
        file: 'ai-quick-start.html',
    },
    'slash-command-workflow-automation-quick-start': {
        title: 'Slash Commands & Workflow Automation',
        icon: 'terminal',
        file: 'slash-command-workflow-automation-quick-start.html',
    },
};

export const CATALOG_FILE = 'guide-browser.html';

/** Plugin URL for a guide HTML file, with cache-busting query. */
export function guidePublicURL(file: string) {
    return `/plugins/${manifest.id}/public/guides/${file}?v=${GUIDE_ASSET_VERSION}`;
}
