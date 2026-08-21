// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

export type Audience = 'end-user' | 'admin';

export type StepMedia = {
    type: 'svg' | 'image';
    file: string;
    alt: string;
};

export type Step = {
    title: string;

    /** May include <strong> tags for emphasis. */
    description: string;
    tip?: string;
    media?: StepMedia;
};

export type CommandItem = {
    command: string;
    description: string;
};

export type CommandGroup = {
    label: string;
    items: CommandItem[];
};

export type Module = {
    id: string;
    navTitle: string;
    icon: string;
    minutes?: number;
    title: string;
    summary: string;
    steps: Step[];
    commandGroups?: CommandGroup[];

    /** Plugin IDs that must all be active for this module to be shown. */
    requiresPlugins?: string[];
};

export type DoneLink = {
    label: string;
    href: string;
};

export type Guide = {
    id: string;
    title: string;
    heroTitle: string;
    subtitle: string;
    description: string;
    icon: string;
    audiences: Audience[];
    modules: Module[];
    doneTitle: string;
    doneSummary: string;
    doneLinks: DoneLink[];

    /** Plugin IDs that must all be active for this guide to be shown. */
    requiresPlugins?: string[];
};
