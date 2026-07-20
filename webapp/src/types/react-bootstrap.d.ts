// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

declare module 'react-bootstrap' {
    import type React from 'react';

    export type OverlayTriggerProps = {
        children: React.ReactElement;
        delayShow?: number;
        delayHide?: number;
        overlay: React.ReactNode;
        placement?: string;
        defaultOverlayShown?: boolean;
    };

    export class OverlayTrigger extends React.Component<OverlayTriggerProps> {}

    export type TooltipProps = {
        id: string;
        children?: React.ReactNode;
        className?: string;
        style?: React.CSSProperties;
    };

    export class Tooltip extends React.Component<TooltipProps> {}
}
