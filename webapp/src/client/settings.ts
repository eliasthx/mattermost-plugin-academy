// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from 'manifest';

export type PluginSettings = {
    enableProfileBadges: boolean;
    userAllowed: boolean;
    disabledGuideIDs: string[];
    isAdmin: boolean;

    /** Null means the server could not determine it; treat as "no filtering". */
    activePluginIDs: string[] | null;

    /** When true, show plugin-gated content and admin-audience guides to everyone. */
    testMode: boolean;
};

export async function fetchPluginSettings(): Promise<PluginSettings> {
    const res = await fetch(`/plugins/${manifest.id}/api/v1/settings`, {
        credentials: 'same-origin',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
    });
    if (!res.ok) {
        throw new Error('failed to load settings');
    }
    const data = await res.json();
    return {
        enableProfileBadges: data.enableProfileBadges !== false,
        userAllowed: data.userAllowed !== false,
        disabledGuideIDs: Array.isArray(data.disabledGuideIDs) ? data.disabledGuideIDs : [],
        isAdmin: data.isAdmin === true,
        activePluginIDs: Array.isArray(data.activePluginIDs) ? data.activePluginIDs : null,
        testMode: data.testMode === true,
    };
}
