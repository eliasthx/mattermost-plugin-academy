// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import manifest from 'manifest';
import React from 'react';

type IconProps = {
    name: string;
    className?: string;
    size?: number;
};

const paths: Record<string, React.ReactNode> = {
    smart_toy: <path d='M12 2a2 2 0 0 1 2 2v1h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h2V4a2 2 0 0 1 2-2zm-3 9a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 9 11zm6 0a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 15 11zM8 16.5h8v1H8v-1zM7 7v1H5.5A1.5 1.5 0 0 0 4 9.5V14a1.5 1.5 0 0 0 1.5 1.5H7V7zm10 0v8.5h1.5A1.5 1.5 0 0 0 20 14V9.5A1.5 1.5 0 0 0 18.5 8H17V7z'/>,
    summarize: <path d='M4 5h16v2H4V5zm0 4h10v2H4V9zm0 4h16v2H4v-2zm0 4h10v2H4v-2z'/>,
    mark_chat_unread: <path d='M4 4h12a2 2 0 0 1 2 2v1.1A5 5 0 0 0 14.1 16H8l-4 3V6a2 2 0 0 1 2-2zm14 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z'/>,
    videocam: <path d='M4 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zm14 2.5 3-2v9l-3-2v-5z'/>,
    manage_search: <path d='M10 4a6 6 0 1 1 3.9 10.6l3.75 3.75-1.4 1.4-3.75-3.74A6 6 0 0 1 10 4zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm7 11h3v2h-5v-5h2v3z'/>,
    draw: <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/>,
    tune: <path d='M3 5h8v2H3V5zm10 0h8v2h-8V5zM3 11h14v2H3v-2zm16 0h2v2h-2v-2zM3 17h4v2H3v-2zm6 0h12v2H9v-2z'/>,
    terminal: <path d='M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm1 3.5 3.5 2.5L5 13.5 6.2 15l5-3.5L6.2 8 5 8.5zM12 14h6v2h-6v-2z'/>,
    list_alt: <path d='M4 5h16v2H4V5zm0 4h4v2H4V9zm6 0h10v2H10V9zm-6 4h4v2H4v-2zm6 0h10v2H10v-2zm-6 4h4v2H4v-2zm6 0h10v2H10v-2z'/>,
    schedule_send: <path d='M16.5 12a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm.75 2.25v2.06l1.4 1.4-.9.9-1.75-1.75V14.25h1.25zM3 4l16 7-6.2 2.07A5.48 5.48 0 0 0 11 16.5c0 .5.06 1 .18 1.46L3 20V4z'/>,
    checklist: <path d='M9 4h12v2H9V4zm0 7h12v2H9v-2zm0 7h12v2H9v-2zM5.5 3.5 7 5l3-3 1.4 1.4L7 7.8 4.1 4.9 5.5 3.5zm0 7L7 12l3-3 1.4 1.4L7 14.8l-2.9-2.9 1.4-1.4zm0 7L7 19l3-3 1.4 1.4L7 21.8l-2.9-2.9 1.4-1.4z'/>,
    bolt: <path d='M11 2 4 14h6l-1 8 9-14h-6l-1-6z'/>,
    arrow_back: <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/>,
    refresh: <path d='M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24L14 10h6V4l-2.35 2.35z'/>,
    open_in_new: <path d='M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z'/>,
    content_copy: <path d='M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z'/>,
    check_circle: <path d='M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.3-3.7-3.7 1.4-1.4 2.3 2.29 5.1-5.1 1.4 1.42-6.5 6.49z'/>,
    check: <path d='M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z'/>,
    school: (
        <>
            <path d='M12 3 1 9l11 6 9-4.91V17h2V9L12 3z'/>
            <path d='M5 13.18v4.32C5 19.8 8.13 21 12 21s7-1.2 7-3.5v-4.32l-7 3.82-7-3.82z'/>
        </>
    ),
    chevron_right: <path d='M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z'/>,
};

/** Lightweight icon set replacing Material Symbols CDN. */
export function AcademyIcon({name, className, size = 20}: IconProps) {
    const content = paths[name] || paths.school;
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
            {content}
        </svg>
    );
}

/** Product switcher icon. */
export function AcademyProductIcon() {
    return (
        <AcademyIcon
            name='school'
            size={24}
        />
    );
}

export const ACADEMY_ICON_URL = `/plugins/${manifest.id}/public/academy-icon.png`;
