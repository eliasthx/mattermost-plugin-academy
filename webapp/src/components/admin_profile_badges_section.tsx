// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

type Props = {
    settingsList?: React.ReactNode[];
};

/**
 * Renders badge settings without a config-section pane
 * (same placement pattern as Enable Plugin on Calls).
 */
export default function ProfileBadgesSection(props: Props) {
    return <>{props.settingsList}</>;
}
