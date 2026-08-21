// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export enum UserAccessLevel {
    All = 0,
    Allow = 1,
    Block = 2,
    None = 3,
}

export type UserAccessConfig = {
    userAccessLevel: UserAccessLevel;
    userIDs: string[];
    teamIDs: string[];
    disabledGuideIDs: string[];

    /** Show plugin-gated content and admin-audience guides to everyone. Off by default. */
    testMode: boolean;
};

export const DEFAULT_USER_ACCESS_CONFIG: UserAccessConfig = {
    userAccessLevel: UserAccessLevel.All,
    userIDs: [],
    teamIDs: [],
    disabledGuideIDs: [],
    testMode: false,
};

function emptyUserAccessConfig(): UserAccessConfig {
    return {...DEFAULT_USER_ACCESS_CONFIG, userIDs: [], teamIDs: [], disabledGuideIDs: []};
}

export function normalizeUserAccessConfig(value: unknown): UserAccessConfig {
    if (!value || typeof value !== 'object') {
        if (typeof value === 'string' && value.trim()) {
            try {
                return normalizeUserAccessConfig(JSON.parse(value));
            } catch {
                return emptyUserAccessConfig();
            }
        }
        return emptyUserAccessConfig();
    }

    const raw = value as Partial<UserAccessConfig>;
    const level = Number(raw.userAccessLevel);
    return {
        userAccessLevel: Number.isFinite(level) ? level as UserAccessLevel : UserAccessLevel.All,
        userIDs: Array.isArray(raw.userIDs) ? raw.userIDs.filter((id): id is string => typeof id === 'string') : [],
        teamIDs: Array.isArray(raw.teamIDs) ? raw.teamIDs.filter((id): id is string => typeof id === 'string') : [],
        disabledGuideIDs: Array.isArray(raw.disabledGuideIDs) ?
            raw.disabledGuideIDs.filter((id): id is string => typeof id === 'string') :
            [],
        testMode: raw.testMode === true,
    };
}
