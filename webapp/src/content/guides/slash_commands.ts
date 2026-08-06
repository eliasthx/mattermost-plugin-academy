// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {Guide} from 'content/types';

const slashCommands: Guide = {
    id: 'slash-command-workflow-automation-quick-start',
    title: 'Slash Commands & Workflow Automation',
    heroTitle: 'COMMAND YOUR WORKFLOW',
    subtitle: 'Five focused modules covering slash commands, scheduled messages, and Playbook automations and triggers — everything you need to become a power user.',
    description: 'Slash commands, scheduled messages, and Playbook automations — become a Mattermost power user.',
    icon: 'terminal',
    audiences: ['end-user', 'admin'],
    doneTitle: 'You\'re automation-ready in Mattermost',
    doneSummary: 'You\'ve covered slash commands, scheduled messages, workflow automations, and Playbook triggers.',
    doneLinks: [
        {label: 'Playbooks documentation', href: 'https://docs.mattermost.com/end-user-guide/workflow-automation.html'},
        {label: 'Full slash command reference', href: 'https://docs.mattermost.com/integrations-guide/built-in-slash-commands.html'},
    ],
    modules: [
        {
            id: 'slash-command-basics',
            navTitle: 'Slash Command Basics',
            icon: 'terminal',
            minutes: 1,
            title: 'Slash command basics',
            summary: 'Slash commands are shortcuts you type in a message box to take action instantly — invite someone, change your status, start a call, and more.',
            steps: [
                {
                    title: 'Open the command picker',
                    description: 'Type / to see available commands in the autocomplete list. This works in channels, DMs, and threads. The same / entry point gives you access to all built-in and Admin-configured commands in your instance.',
                },
                {
                    title: 'Filter and select',
                    description: 'Autocomplete filters matching commands in real time. Use keyboard_arrow_up keyboard_arrow_down to navigate options, then press Tab or Enter to select one.',
                },
            ],
        },
        {
            id: 'built-in-commands',
            navTitle: 'Built-in Commands',
            icon: 'list_alt',
            minutes: 2,
            title: 'Built-in commands',
            summary: 'These commands work out of the box in every Mattermost instance — no plugins or Admin setup required. Click any command to copy it.',
            steps: [
            ],
            commandGroups: [
                {
                    label: 'People',
                    items: [
                        {command: '/invite @username', description: 'Invite someone to the current channel'},
                        {command: '/remove @username', description: 'Remove someone from the current channel'},
                    ],
                },
                {
                    label: 'Channels',
                    items: [
                        {command: '/join channel-name', description: 'Join a channel'},
                        {command: '/leave', description: 'Leave the current channel'},
                        {command: '/mute', description: 'Silence notifications for the current channel'},
                        {command: '/header', description: 'Edit the current channel header'},
                    ],
                },
                {
                    label: 'Conversations',
                    items: [
                        {command: '/msg @username', description: 'Send a direct message'},
                        {command: '/search', description: 'Search message text'},
                        {command: '/collapse', description: 'Collapse image previews by default'},
                        {command: '/expand', description: 'Expand image previews by default'},
                    ],
                },
                {
                    label: 'Status',
                    items: [
                        {command: '/status', description: 'Set a custom status message and emoji'},
                        {command: '/away', description: 'Set availability to Away'},
                        {command: '/offline', description: 'Set availability to Offline'},
                        {command: '/online', description: 'Set availability to Online'},
                        {command: '/dnd', description: 'Set availability to Do Not Disturb'},
                    ],
                },
                {
                    label: 'Calls',
                    items: [
                        {command: '/call start', description: 'Start a call in this channel'},
                        {command: '/call join', description: 'Join a call in this channel'},
                    ],
                },
                {
                    label: 'General',
                    items: [
                        {command: '/shortcuts', description: 'Show keyboard shortcuts'},
                        {command: '/settings', description: 'Open Settings'},
                    ],
                },
            ],
        },
        {
            id: 'scheduled-messages',
            navTitle: 'Scheduled Messages',
            icon: 'schedule_send',
            minutes: 2,
            title: 'Scheduled messages',
            summary: 'Compose a message now and send it at exactly the right time — no slash command needed and no Admin setup required.',
            steps: [
                {
                    title: 'Compose your message',
                    description: 'Write your message in any channel or DM as you normally would. When you\'re ready to schedule it, click the <strong>arrow</strong> next to the send button.',
                    media: {
                        type: 'image',
                        file: 'scheduled-messages-step1-9259c4fcaa.svg',
                        alt: 'Message composer with Schedule message menu open',
                    },
                },
                {
                    title: 'Pick a date and time',
                    description: 'Choose a preset time or set a custom date and time — Mattermost queues and sends it automatically.',
                },
                {
                    title: 'When to use it',
                    description: 'Scheduled messages are especially useful when your team spans timezones, when you want to post an announcement at a specific moment, or when you finish writing something in the evening but don\'t want to ping everyone until morning.',
                },
            ],
        },
        {
            id: 'workflow-automations',
            navTitle: 'Workflow Automations',
            icon: 'checklist',
            minutes: 3,
            title: 'Workflow automations with Playbooks',
            summary: 'A Playbook is a repeatable digital checklist your team configures once and reuses. You build it once, and run it for instances of the same process.',
            steps: [
                {
                    title: 'Create a Playbook',
                    description: 'Select <strong>Playbooks</strong> from the main menu and <strong>create new Playbook</strong>. Name it, then define the structured checklist, assigned owners, and a status timeline.',
                    media: {
                        type: 'image',
                        file: 'workflow-automations-step1-f68b94cf7e.svg',
                        alt: 'Playbook run checklist showing three tasks with assignees and due dates',
                    },
                },
                {
                    title: 'Slash commands attached to tasks',
                    description: 'Individual checklist tasks can have a slash command wired to them. Run participants engaging with the checklist can kick off slash commands in a single click.',
                    media: {
                        type: 'image',
                        file: 'workflow-automations-step2-4e70b86c6b.svg',
                        alt: 'Checklist task with assignee, due date, and Run slash command',
                    },
                },
                {
                    title: 'Start a Run',
                    description: 'From any channel, type <strong>/playbook run</strong> and select the playbook you want. The process and checklist is already defined in the Playbook — you just execute it. Mattermost creates the channel and checklist automatically.',
                },
                {
                    title: 'Common use cases',
                    description: 'Playbooks are used anywhere a team needs a consistent, repeatable process.',
                },
            ],
        },
        {
            id: 'playbook-triggers',
            navTitle: 'Playbook Triggers',
            icon: 'bolt',
            minutes: 2,
            title: 'Playbook triggers',
            summary: 'Playbooks can start from a slash command or a keyword in a channel. Use webhooks to stream in alert data from connected systems, then setup keywords to trigger your Playbook workflows.',
            steps: [
                {
                    title: 'Keyword triggers',
                    description: 'Access <strong>Channel Actions</strong> from the channel menu, then type a keyword and select the Playbook that should run. The keyword can be a specific word or phrase that appears in messages — for example <strong>SEV1</strong>, <strong>outage</strong>, or <strong>deploy failed</strong>.',
                    media: {
                        type: 'image',
                        file: 'playbook-triggers-step1-9e6405dce4.svg',
                        alt: 'Channel Actions modal showing a keyword trigger with Prompt to run a playbook enabled',
                    },
                },
                {
                    title: 'Slash commands during an active run',
                    description: 'Manage ownership, status, and completion while a run is in progress.',
                },
            ],
        },
    ],
};

export default slashCommands;
