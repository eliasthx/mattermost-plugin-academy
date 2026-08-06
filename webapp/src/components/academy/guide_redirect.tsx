// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchGuideProgress} from 'client/progress';
import {getGuide, routes} from 'content';
import React, {useEffect, useState} from 'react';
import {Redirect, useParams} from 'react-router-dom';

/** Sends `/guides/:guideId` to the first incomplete module (or done). */
export default function GuideRedirect() {
    const {guideId} = useParams<{guideId: string}>();
    const guide = getGuide(guideId);
    const [target, setTarget] = useState<string | null>(null);

    useEffect(() => {
        if (!guide) {
            setTarget(routes.catalog);
            return undefined;
        }
        let cancelled = false;
        fetchGuideProgress(guide.id).
            then((rec) => {
                if (cancelled) {
                    return;
                }
                const done = new Set(rec.completedModuleIds || []);
                if (guide.modules.every((m) => done.has(m.id))) {
                    setTarget(routes.done(guide.id));
                    return;
                }
                const next = guide.modules.find((m) => !done.has(m.id)) || guide.modules[0];
                setTarget(routes.module(guide.id, next.id));
            }).
            catch(() => {
                if (!cancelled) {
                    setTarget(routes.module(guide.id, guide.modules[0].id));
                }
            });
        return () => {
            cancelled = true;
        };
    }, [guide]);

    if (!guide) {
        return <Redirect to={routes.catalog}/>;
    }
    if (!target) {
        return null;
    }
    return <Redirect to={target}/>;
}
