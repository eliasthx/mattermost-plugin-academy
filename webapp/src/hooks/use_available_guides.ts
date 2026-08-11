// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchPluginSettings} from 'client/settings';
import {GUIDE_LIST} from 'content';
import type {Guide} from 'content';
import {useEffect, useMemo, useState} from 'react';

type GuidesState = {
    guides: Guide[];
    disabledGuideIDs: string[];
    loading: boolean;
};

export function useAvailableGuides(): GuidesState {
    const [disabledGuideIDs, setDisabledGuideIDs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchPluginSettings().
            then((settings) => {
                if (!cancelled) {
                    setDisabledGuideIDs(settings.disabledGuideIDs);
                }
            }).
            catch(() => {
                if (!cancelled) {
                    setDisabledGuideIDs([]);
                }
            }).
            finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const guides = useMemo(
        () => GUIDE_LIST.filter((guide) => !disabledGuideIDs.includes(guide.id)),
        [disabledGuideIDs],
    );

    return {guides, disabledGuideIDs, loading};
}

export function isGuideEnabled(guideID: string, disabledGuideIDs: string[]) {
    return !disabledGuideIDs.includes(guideID);
}
