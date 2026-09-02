// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/**
 * Inserts `media` blocks into a guide's content file, keyed on step title.
 *
 * Alt text is read out of shots.js rather than restated here, so the two cannot drift: the
 * capture and the guide always describe the same image with the same words.
 *
 *   node wire_media.mjs <guide-id>
 *
 * Idempotent — a step that already has media is left alone. Steps with no mapped shot keep no
 * media, which is the normal case for concept-only steps.
 */

import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

/** guide id -> content file, and step title -> shot id. */
const GUIDES = {
    'mattermost-basics': {
        file: 'mattermost_basics.ts',
        steps: {
            'Know the kinds of conversation': 'channel-types',
            'Browse and join channels': 'browse-channels',
            'Favorite the channels you live in': 'sidebar-overview',
            'Group channels into custom categories': 'create-category',
            'Sort and mute': 'category-menu',
            'Cut the noise with the unreads filter': 'unreads-filter',
            'Reply in a thread': 'thread-reply',
            'Follow and unfollow': 'thread-follow',
            'Work from the Threads view': 'threads-view',
            'Open your notification settings': 'notification-settings',
            'Add keywords that trigger notifications': 'notification-keywords',
            'Override settings for a single channel': 'channel-notification-preferences',
            'Use Do Not Disturb and a custom status': 'status-menu',
            'Leave a draft and come back to it': 'drafts-view',
            'Set message priority': 'message-priority',
            'Use the formatting toolbar': 'formatting-toolbar',
            'Preview before you send': 'formatting-preview',
            'Save a message for yourself': 'saved-messages',
            'Pin a message for the channel': 'message-actions-menu',
            'Set a reminder': 'remind-menu',
            'Jump anywhere with the quick switcher': 'quick-switcher',
            'Check your recent mentions': 'recent-mentions',
            'React instead of replying': 'emoji-reaction',
        },
    },
    /**
     * Two steps, out of 31, and both are the same dialog — which genuinely is the screen both
     * point at. Update Guide is mostly CLI and process: backups, schema migrations, rollbacks.
     * The pre-flight items that *would* suit a screenshot (plugin versions, PostgreSQL) are
     * `ChecklistItem`s rather than `Step`s, and ChecklistItem has no `media` field, so they
     * cannot carry art without a type and renderer change.
     */
    'update-guide': {
        file: 'update_guide.ts',
        steps: {
            'Find the version you are running': 'about-mattermost',
            'Confirm the version and schema version': 'about-mattermost',
        },
    },
    boards: {
        file: 'boards.ts',
        steps: {
            'Organize your sidebar': 'boards-sidebar',
            'Add a card': 'boards-kanban',
            'Write the description': 'boards-card-detail',
            'Show the properties that matter on the board': 'boards-properties-menu',
            'Group cards': 'boards-group-by',
            'Filter down to what you need': 'boards-filter',
            Sort: 'boards-sort',
            'Open the Share dialog': 'boards-share-dialog',
        },
    },
    'slash-command-workflow-automation-quick-start': {
        file: 'slash_commands.ts',
        steps: {
            'Open the command picker': 'slash-command-picker',
            'Filter and select': 'slash-command-filtered',
        },
    },
    'advanced-search': {
        file: 'advanced_search.ts',
        steps: {
            'Choose Messages or Files': 'search-results-tabs',
            'Find messages from a person': 'search-from-autocomplete',
            'Find messages in a channel': 'search-in-autocomplete',
            'Combine both to cut results down fast': 'search-modifiers-combined',
            'Use the date picker instead of typing': 'search-date-picker',
            'Quote an exact phrase': 'search-exact-phrase',
            'Search hashtags': 'search-hashtag',
            'Switch to the Files tab': 'search-files-tab',
            'Filter by file extension': 'search-file-extension',
            'Review your recent mentions': 'search-recent-mentions',
            'Set messages aside and come back to them': 'search-saved-messages',
        },
    },
};

/** id -> alt, parsed out of the shot list. */
function altTextByShotId() {
    const source = readFileSync(path.join(HERE, 'shots.js'), 'utf8');
    // Keys between `module` and `alt` are optional — admin shots carry `as: 'admin'` there —
    // so anything that is not itself an `alt:` line is skipped rather than breaking the match.
    const re = /id: '([^']+)',\s*\n\s*guide: '[^']+',\s*\n\s*module: '[^']+',\s*\n(?:\s*(?!alt:)\w+: [^\n]*\n)*\s*alt: '((?:[^'\\]|\\.)*)'/g;
    const alts = {};
    for (let m; (m = re.exec(source));) {
        // The captured text is still JS-escaped, because shots.js writes `plugin\\'s`. Unescape
        // it here so the single escaping applied on output is the only one — escaping an
        // already-escaped apostrophe produces `\\\\'` and a syntax error in the guide file.
        alts[m[1]] = m[2].replace(/\\(['\\])/g, '$1');
    }
    return alts;
}

function wire(guideId) {
    const guide = GUIDES[guideId];
    if (!guide) {
        throw new Error(`no mapping for guide "${guideId}". Known: ${Object.keys(GUIDES).join(', ')}`);
    }

    const alts = altTextByShotId();
    const file = path.join(ROOT, 'webapp', 'src', 'content', 'guides', guide.file);
    const lines = readFileSync(file, 'utf8').split('\n');

    const out = [];
    let inserted = 0;
    let present = 0;

    for (let i = 0; i < lines.length; i++) {
        out.push(lines[i]);

        const titleMatch = lines[i].match(/^(\s*)title: '((?:[^'\\]|\\.)*)',$/);
        if (!titleMatch) {
            continue;
        }

        const title = titleMatch[2].replace(/\\'/g, "'");
        const shotId = guide.steps[title];
        if (!shotId) {
            continue;
        }
        if (!alts[shotId]) {
            throw new Error(`shots.js has no alt text for "${shotId}" (step "${title}")`);
        }

        // Descriptions are always a single line in these files.
        const descIdx = i + 1;
        if (!/^\s*description: /.test(lines[descIdx])) {
            throw new Error(`step "${title}" is not followed by a description line`);
        }
        out.push(lines[descIdx]);
        i = descIdx;

        if (/^\s*media: \{/.test(lines[i + 1] || '')) {
            present++;
            continue;
        }

        const pad = titleMatch[1];
        out.push(`${pad}media: {`);
        out.push(`${pad}    type: 'image',`);
        out.push(`${pad}    file: '${shotId}.webp',`);
        out.push(`${pad}    alt: '${alts[shotId].replace(/'/g, "\\'")}',`);
        out.push(`${pad}},`);
        inserted++;
    }

    const mapped = Object.keys(guide.steps).length;
    if (inserted + present !== mapped) {
        throw new Error(
            `${guideId}: mapped ${mapped} steps but matched ${inserted + present}. ` +
            'A step title in the mapping no longer matches the guide.',
        );
    }

    writeFileSync(file, out.join('\n'));
    console.log(`${guideId}: inserted ${inserted}, already present ${present}, mapped ${mapped}`);
}

const [guideId] = process.argv.slice(2);
if (!guideId) {
    console.error(`usage: node wire_media.mjs <${Object.keys(GUIDES).join('|')}>`);
    process.exit(1);
}
wire(guideId);
