// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ICON_NAMES} from 'components/icons';
import {GUIDE_LIST} from 'content';
import type {Guide, Module} from 'content/types';

/** Mirrors validGuideID in server/progress/progress.go. */
const GUIDE_ID = /^[a-z0-9_-]+$/;

/**
 * Material icon ligatures leaked into copy when the guides were ported from
 * HTML: 'keyboard_arrow_up' and a leading 'info ' both rendered as literal
 * words. Hrefs are stripped first because admin console paths legitimately
 * contain underscores.
 */
const LIGATURE = /\b[a-z]+_[a-z_]+\b/;
const LIGATURE_PREFIX = /^(info|warning|error|check|lightbulb|help)\s/;

function proseOf(guide: Guide): Array<{where: string; text: string}> {
    const out: Array<{where: string; text: string}> = [];
    const add = (where: string, text?: string) => {
        if (text) {
            out.push({where: `${guide.id} ${where}`, text});
        }
    };

    add('subtitle', guide.subtitle);
    add('description', guide.description);
    add('doneSummary', guide.doneSummary);

    guide.modules.forEach((mod) => {
        add(`${mod.id} summary`, mod.summary);
        mod.steps.forEach((step, i) => {
            add(`${mod.id} step ${i} title`, step.title);
            add(`${mod.id} step ${i} description`, step.description);
            add(`${mod.id} step ${i} tip`, step.tip);
        });
        mod.variants?.forEach((variant) => {
            variant.steps.forEach((step, i) => {
                add(`${mod.id} ${variant.label} step ${i} description`, step.description);
                add(`${mod.id} ${variant.label} step ${i} tip`, step.tip);
            });
        });
        mod.tiers?.forEach((tier) => {
            add(`${mod.id} ${tier.label} summary`, tier.summary);
            tier.items.forEach((item) => add(`${mod.id} ${tier.label} ${item.name}`, item.description));
        });
        mod.checklist?.forEach((item) => add(`${mod.id} checklist ${item.title}`, item.description));
    });

    return out;
}

function withoutHrefs(text: string): string {
    return text.replace(/<a\s+href="[^"]*"\s*>/gi, '');
}

function allModules(): Array<{guide: Guide; mod: Module}> {
    return GUIDE_LIST.flatMap((guide) => guide.modules.map((mod) => ({guide, mod})));
}

describe('guide registry', () => {
    it('has at least one guide', () => {
        expect(GUIDE_LIST.length).toBeGreaterThan(0);
    });

    it('uses guide ids the server will accept, with no duplicates', () => {
        const ids = GUIDE_LIST.map((guide) => guide.id);

        ids.forEach((id) => expect(id).toMatch(GUIDE_ID));
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('gives every guide at least one module', () => {
        GUIDE_LIST.forEach((guide) => {
            expect(guide.modules.length).toBeGreaterThan(0);
        });
    });

    it('keeps module ids unique within each guide', () => {
        GUIDE_LIST.forEach((guide) => {
            const ids = guide.modules.map((mod) => mod.id);
            expect(new Set(ids).size).toBe(ids.length);
        });
    });
});

describe('guide icons', () => {
    it('only uses icon names AcademyIcon can resolve', () => {
        GUIDE_LIST.forEach((guide) => {
            expect(ICON_NAMES).toContain(guide.icon);
        });
        allModules().forEach(({mod}) => {
            expect(ICON_NAMES).toContain(mod.icon);
        });
    });
});

describe('guide copy', () => {
    it('contains no leaked icon ligatures', () => {
        GUIDE_LIST.flatMap(proseOf).forEach(({where, text}) => {
            expect(`${where}: ${withoutHrefs(text)}`).not.toMatch(LIGATURE);
        });
    });

    it('does not begin a string with an icon ligature word', () => {
        GUIDE_LIST.flatMap(proseOf).forEach(({where, text}) => {
            expect(`${where}|${text}`.split('|')[1]).not.toMatch(LIGATURE_PREFIX);
        });
    });

    it('keeps markup out of fields that render literally', () => {
        // The catalog card is wrapped in a link, so its description cannot
        // carry an anchor without nesting one inside another.
        GUIDE_LIST.forEach((guide) => {
            expect(guide.description).not.toMatch(/<[a-z/]/i);
            expect(guide.title).not.toMatch(/<[a-z/]/i);
            expect(guide.heroTitle).not.toMatch(/<[a-z/]/i);
            expect(guide.doneTitle).not.toMatch(/<[a-z/]/i);

            guide.modules.forEach((mod) => {
                expect(mod.title).not.toMatch(/<[a-z/]/i);
                expect(mod.navTitle).not.toMatch(/<[a-z/]/i);
                mod.steps.forEach((step) => expect(step.title).not.toMatch(/<[a-z/]/i));
            });
        });
    });

    it('only links to https or in-app paths', () => {
        GUIDE_LIST.flatMap(proseOf).forEach(({text}) => {
            for (const match of text.matchAll(/<a\s+href="([^"]*)"/gi)) {
                expect(match[1]).toMatch(/^(https:\/\/|\/(?!\/))/);
            }
        });

        GUIDE_LIST.forEach((guide) => {
            guide.doneLinks.forEach((link) => {
                expect(link.href).toMatch(/^(https:\/\/|\/(?!\/))/);
            });
        });
    });
});
