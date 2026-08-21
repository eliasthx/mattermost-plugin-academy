// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchPluginSettings} from 'client/settings';
import {GUIDE_LIST, getGuide, resolveGuide} from 'content';
import type {Guide} from 'content';
import {useEffect, useMemo, useState} from 'react';

type GuidesState = {
    guides: Guide[];
    disabledGuideIDs: string[];
    activePluginIDs: string[] | null;
    loading: boolean;
};

type Availability = {
    disabledGuideIDs: string[];
    activePluginIDs: string[] | null;
    loading: boolean;
};

function useAvailability(): Availability {
    const [disabledGuideIDs, setDisabledGuideIDs] = useState<string[]>([]);
    const [activePluginIDs, setActivePluginIDs] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchPluginSettings().
            then((settings) => {
                if (!cancelled) {
                    setDisabledGuideIDs(settings.disabledGuideIDs);
                    setActivePluginIDs(settings.activePluginIDs);
                }
            }).
            catch(() => {
                if (!cancelled) {
                    setDisabledGuideIDs([]);
                    setActivePluginIDs(null);
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

    return {disabledGuideIDs, activePluginIDs, loading};
}

/**
 * Guides the current user should see, with unavailable modules already removed
 * so callers can use `guide.modules` without repeating the filtering.
 */
export function useAvailableGuides(): GuidesState {
    const {disabledGuideIDs, activePluginIDs, loading} = useAvailability();

    const guides = useMemo(
        () => GUIDE_LIST.
            filter((guide) => !disabledGuideIDs.includes(guide.id)).
            map((guide) => resolveGuide(guide, activePluginIDs)).
            filter((guide): guide is Guide => Boolean(guide)),
        [activePluginIDs, disabledGuideIDs],
    );

    return {guides, disabledGuideIDs, activePluginIDs, loading};
}

/** Single-guide equivalent of useAvailableGuides, for the guide routes. */
export function useAvailableGuide(guideId: string): {guide: Guide | undefined; loading: boolean} {
    const {disabledGuideIDs, activePluginIDs, loading} = useAvailability();

    const guide = useMemo(() => {
        const found = getGuide(guideId);
        if (!found || disabledGuideIDs.includes(found.id)) {
            return undefined;
        }
        return resolveGuide(found, activePluginIDs);
    }, [activePluginIDs, disabledGuideIDs, guideId]);

    return {guide, loading};
}