// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {GUIDES as CONTENT_GUIDES} from 'content';

/** Lightweight catalog metadata for admin charts and profile badges. */
export type GuideMeta = {
    title: string;
    icon: string;
};

export const GUIDES: Record<string, GuideMeta> = Object.fromEntries(
    Object.entries(CONTENT_GUIDES).map(([id, guide]) => [
        id,
        {title: guide.title, icon: guide.icon},
    ]),
);
