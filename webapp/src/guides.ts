// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

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
