// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchPluginSettings} from 'client/settings';
import {useEffect, useState} from 'react';

type AccessState = 'loading' | 'allowed' | 'denied';

export function useAcademyAccess(): AccessState {
    const [state, setState] = useState<AccessState>('loading');

    useEffect(() => {
        let cancelled = false;
        fetchPluginSettings().
            then((settings) => {
                if (!cancelled) {
                    setState(settings.userAllowed ? 'allowed' : 'denied');
                }
            }).
            catch(() => {
                // Fail open so a settings blip does not lock users out of Academy.
                if (!cancelled) {
                    setState('allowed');
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return state;
}
