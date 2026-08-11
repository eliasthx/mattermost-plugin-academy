// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

/**
 * Renders guide copy that may include simple <strong> emphasis from content data.
 */
export default function RichText({text}: {text: string}) {
    const parts = text.split(/(<\/?strong>)/i);
    const nodes: React.ReactNode[] = [];
    let bold = false;
    parts.forEach((part, index) => {
        if (!part) {
            return;
        }
        if ((/^<strong>$/i).test(part)) {
            bold = true;
            return;
        }
        if ((/^<\/strong>$/i).test(part)) {
            bold = false;
            return;
        }
        nodes.push(bold ? <strong key={index}>{part}</strong> : <React.Fragment key={index}>{part}</React.Fragment>);
    });
    return <>{nodes}</>;
}
