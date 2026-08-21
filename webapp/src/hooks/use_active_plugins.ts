// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchPluginSettings} from 'client/settings';
import {useEffect, useState} from 'react';

/**
 * Plugin IDs currently running, or null while loading or when the server
 * could not tell us.
 */
export function useActivePluginIDs(): string[] | null {
    const [activePluginIDs, setActivePluginIDs] = useState<string[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchPluginSettings().
            then((settings) => {
                if (!cancelled) {
                    setActivePluginIDs(settings.activePluginIDs);
                }
            }).
            catch(() => {
                if (!cancelled) {
                    setActivePluginIDs(null);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return activePluginIDs;
}
