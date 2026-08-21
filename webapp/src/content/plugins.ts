// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/** IDs as reported by the server's plugin list, for use in requiresPlugins. */
export const PLUGIN_IDS = {
    agents: 'mattermost-ai',
    playbooks: 'playbooks',
    boards: 'focalboard',
    calls: 'com.mattermost.calls',
} as const;

const PLUGIN_LABELS: Record<string, string> = {
    [PLUGIN_IDS.agents]: 'Agents',
    [PLUGIN_IDS.playbooks]: 'Playbooks',
    [PLUGIN_IDS.boards]: 'Boards',
    [PLUGIN_IDS.calls]: 'Calls',
};

/** Human-readable name for the System Console; falls back to the raw ID. */
export function pluginLabel(pluginID: string): string {
    return PLUGIN_LABELS[pluginID] ?? pluginID;
}
