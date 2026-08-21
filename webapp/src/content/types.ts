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

export type TierItem = {
    name: string;
    description: string;

    /** Shown as a badge, e.g. 'Enterprise'. */
    edition?: string;
};

/** A level of a graded model, such as a security maturity tier. */
export type Tier = {
    label: string;
    summary: string;
    items: TierItem[];
};

/** One of several alternative paths through the same task, e.g. per platform. */
export type Variant = {
    label: string;
    steps: Step[];
};

export type ChecklistItem = {
    title: string;

    /** May include <strong> tags for emphasis. */
    description: string;
};

/**
 * Content blocks render in a fixed order: tiers, steps, variants, checklist,
 * commandGroups. Modules use whichever subset fits; not everything is a
 * numbered procedure.
 */
export type Module = {
    id: string;
    navTitle: string;
    icon: string;
    minutes?: number;
    title: string;
    summary: string;
    steps: Step[];
    tiers?: Tier[];
    variants?: Variant[];
    checklist?: ChecklistItem[];
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
