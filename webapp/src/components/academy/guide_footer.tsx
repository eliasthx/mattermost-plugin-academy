// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {createContext, useContext, useLayoutEffect, useMemo, useState} from 'react';
import type {ReactNode} from 'react';

type GuideFooterContextValue = {
    setFooter: (node: ReactNode) => void;
};

const GuideFooterContext = createContext<GuideFooterContextValue | null>(null);

export function useGuideFooterState() {
    const [footer, setFooter] = useState<ReactNode>(null);
    const api = useMemo(() => ({setFooter}), []);
    return {footer, api};
}

export function GuideFooterProvider({
    api,
    children,
}: {
    api: GuideFooterContextValue;
    children: ReactNode;
}) {
    return (
        <GuideFooterContext.Provider value={api}>
            {children}
        </GuideFooterContext.Provider>
    );
}

/** Registers footer content into the sticky slot beside the guide scroller. */
export function GuideFooter({children}: {children: ReactNode}) {
    const ctx = useContext(GuideFooterContext);
    if (!ctx) {
        throw new Error('GuideFooter must be used within GuideFooterProvider');
    }

    useLayoutEffect(() => {
        ctx.setFooter(children);
        return () => ctx.setFooter(null);
    }, [children, ctx]);

    return null;
}
