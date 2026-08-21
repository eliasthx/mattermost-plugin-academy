// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {meetsPluginRequirements, resolveGuide, visibleModules} from 'content';
import type {Guide, Module} from 'content/types';

function makeModule(id: string, requiresPlugins?: string[]): Module {
    return {
        id,
        navTitle: id,
        icon: 'check',
        title: id,
        summary: '',
        steps: [],
        requiresPlugins,
    };
}

function makeGuide(modules: Module[], requiresPlugins?: string[]): Guide {
    return {
        id: 'guide',
        title: 'Guide',
        heroTitle: 'Guide',
        subtitle: '',
        description: '',
        icon: 'check',
        audiences: ['end-user'],
        modules,
        doneTitle: '',
        doneSummary: '',
        doneLinks: [],
        requiresPlugins,
    };
}

describe('meetsPluginRequirements', () => {
    it('allows content with no requirements', () => {
        expect(meetsPluginRequirements(undefined, [])).toBe(true);
        expect(meetsPluginRequirements([], [])).toBe(true);
    });

    it('allows content when the active plugin list is unknown', () => {
        expect(meetsPluginRequirements(['playbooks'], null)).toBe(true);
    });

    it('requires every listed plugin to be active', () => {
        expect(meetsPluginRequirements(['playbooks'], ['playbooks'])).toBe(true);
        expect(meetsPluginRequirements(['playbooks', 'focalboard'], ['playbooks'])).toBe(false);
        expect(meetsPluginRequirements(['playbooks'], [])).toBe(false);
    });
});

describe('visibleModules', () => {
    it('drops modules whose plugin is not active', () => {
        const guide = makeGuide([
            makeModule('always'),
            makeModule('boards-only', ['focalboard']),
        ]);

        expect(visibleModules(guide, []).map((m) => m.id)).toEqual(['always']);
        expect(visibleModules(guide, ['focalboard']).map((m) => m.id)).toEqual(['always', 'boards-only']);
    });
});

describe('resolveGuide', () => {
    it('hides a guide whose required plugin is not active', () => {
        const guide = makeGuide([makeModule('one')], ['focalboard']);

        expect(resolveGuide(guide, [])).toBeUndefined();
        expect(resolveGuide(guide, ['focalboard'])).toBe(guide);
    });

    it('hides a guide once every module is filtered out', () => {
        const guide = makeGuide([makeModule('one', ['focalboard'])]);

        expect(resolveGuide(guide, [])).toBeUndefined();
    });

    it('returns a trimmed copy when only some modules are filtered out', () => {
        const guide = makeGuide([makeModule('one'), makeModule('two', ['focalboard'])]);
        const resolved = resolveGuide(guide, []);

        expect(resolved).not.toBe(guide);
        expect(resolved?.modules.map((m) => m.id)).toEqual(['one']);
    });

    it('returns the original guide when nothing is filtered', () => {
        const guide = makeGuide([makeModule('one')]);

        expect(resolveGuide(guide, [])).toBe(guide);
    });
});
