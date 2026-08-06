// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from 'manifest';
import React from 'react';

import AiSummarizeIcon from '@mattermost/compass-icons/components/ai-summarize';
import ArrowLeftIcon from '@mattermost/compass-icons/components/arrow-left';
import BookOutlineIcon from '@mattermost/compass-icons/components/book-outline';
import CheckIcon from '@mattermost/compass-icons/components/check';
import CheckCircleOutlineIcon from '@mattermost/compass-icons/components/check-circle-outline';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import ClockSendOutlineIcon from '@mattermost/compass-icons/components/clock-send-outline';
import ConsoleIcon from '@mattermost/compass-icons/components/console';
import ContentCopyIcon from '@mattermost/compass-icons/components/content-copy';
import DrawIcon from '@mattermost/compass-icons/components/draw';
import FormatListBulletedIcon from '@mattermost/compass-icons/components/format-list-bulleted';
import LightningBoltOutlineIcon from '@mattermost/compass-icons/components/lightning-bolt-outline';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import OpenInNewIcon from '@mattermost/compass-icons/components/open-in-new';
import PlaylistCheckIcon from '@mattermost/compass-icons/components/playlist-check';
import RefreshIcon from '@mattermost/compass-icons/components/refresh';
import RobotHappyIcon from '@mattermost/compass-icons/components/robot-happy';
import SearchListIcon from '@mattermost/compass-icons/components/search-list';
import TuneIcon from '@mattermost/compass-icons/components/tune';
import VideoOutlineIcon from '@mattermost/compass-icons/components/video-outline';

type IconComponent = React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
}>;

type IconProps = {
    name: string;
    className?: string;
    size?: number;
};

/** Maps guide/UI icon keys to Compass Icons components. */
const ICONS: Record<string, IconComponent> = {
    'robot-happy': RobotHappyIcon,
    'ai-summarize': AiSummarizeIcon,
    'message-text-outline': MessageTextOutlineIcon,
    'video-outline': VideoOutlineIcon,
    'search-list': SearchListIcon,
    draw: DrawIcon,
    tune: TuneIcon,
    console: ConsoleIcon,
    'format-list-bulleted': FormatListBulletedIcon,
    'clock-send-outline': ClockSendOutlineIcon,
    'playlist-check': PlaylistCheckIcon,
    'lightning-bolt-outline': LightningBoltOutlineIcon,
    'arrow-left': ArrowLeftIcon,
    refresh: RefreshIcon,
    'open-in-new': OpenInNewIcon,
    'content-copy': ContentCopyIcon,
    'check-circle-outline': CheckCircleOutlineIcon,
    check: CheckIcon,
    'book-outline': BookOutlineIcon,
    'chevron-right': ChevronRightIcon,
};

export function AcademyIcon({name, className, size = 20}: IconProps) {
    const Icon = ICONS[name] || BookOutlineIcon;
    return (
        <Icon
            className={className}
            size={size}
            aria-hidden={true}
        />
    );
}

/** Product switcher icon — Academy graduation cap. */
export function AcademyProductIcon({size = 24, className}: {size?: number; className?: string} = {}) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden={true}
            focusable='false'
        >
            <path d='M12 3L1 9l11 6 9-4.91V17h2V9L12 3z'/>
            <path d='M5 13.18v4.32C5 19.8 8.13 21 12 21s7-1.2 7-3.5v-4.32l-7 3.82-7-3.82z'/>
        </svg>
    );
}

export const ACADEMY_ICON_URL = `/plugins/${manifest.id}/public/academy-icon.png`;
