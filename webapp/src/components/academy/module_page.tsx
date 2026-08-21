// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {routes} from 'content';
import React, {useCallback, useMemo, useState} from 'react';
import {Link, Redirect, useHistory, useParams} from 'react-router-dom';

import {GuideFooter} from 'components/academy/guide_footer';
import {useGuideContext} from 'components/academy/guide_context';
import {Checklist, CommandGroups, StepList, TierList, VariantTabs} from 'components/academy/module_blocks';
import RichText from 'components/academy/rich_text';
import {AcademyIcon} from 'components/icons';

function completeLabel(alreadyDone: boolean, isLast: boolean) {
    if (alreadyDone) {
        return isLast ? 'View completion' : 'Continue';
    }
    return isLast ? 'Complete guide' : 'Complete & continue';
}

export default function ModulePage() {
    const {moduleId} = useParams<{guideId: string; moduleId: string}>();
    const {guide, completed, completeModule} = useGuideContext();
    const history = useHistory();
    const [saving, setSaving] = useState(false);

    const index = guide.modules.findIndex((m) => m.id === moduleId);
    if (index < 0) {
        return <Redirect to={routes.guide(guide.id)}/>;
    }

    const mod = guide.modules[index];
    const prev = index > 0 ? guide.modules[index - 1] : null;
    const next = index < guide.modules.length - 1 ? guide.modules[index + 1] : null;
    const isLast = !next;

    const onComplete = useCallback(async () => {
        setSaving(true);
        try {
            await completeModule(mod.id);
            if (isLast) {
                history.push(routes.done(guide.id));
            } else if (next) {
                history.push(routes.module(guide.id, next.id));
            }
        } finally {
            setSaving(false);
        }
    }, [completeModule, guide.id, history, isLast, mod.id, next]);

    const footer = useMemo(() => (
        <div className='academy-module__footer'>
            {prev ? (
                <Link
                    className='academy-btn academy-btn--tertiary'
                    to={routes.module(guide.id, prev.id)}
                >
                    <AcademyIcon
                        name='arrow-left'
                        size={16}
                    />
                    {'Back'}
                </Link>
            ) : (
                <Link
                    className='academy-btn academy-btn--tertiary'
                    to={routes.catalog}
                >
                    <AcademyIcon
                        name='arrow-left'
                        size={16}
                    />
                    {'All guides'}
                </Link>
            )}
            <button
                type='button'
                className='academy-btn academy-btn--primary'
                onClick={onComplete}
                disabled={saving}
            >
                {completeLabel(completed.has(mod.id), isLast)}
            </button>
        </div>
    ), [completed, guide.id, isLast, mod.id, onComplete, prev, saving]);


    return (
        <div className='academy-module'>
            <GuideFooter>{footer}</GuideFooter>
            <div className='academy-module__content'>
                <div className='academy-module__hero'>
                    <div className='academy-module__eyebrow'>
                        {`Module ${index + 1} of ${guide.modules.length}`}
                    </div>
                    <h2 className='academy-module__title'>{mod.title}</h2>
                    <p className='academy-module__summary'>
                        <RichText text={mod.summary}/>
                    </p>
                </div>

                <div className='academy-module__steps'>
                    {mod.tiers?.length ? <TierList tiers={mod.tiers}/> : null}

                    <StepList
                        guideId={guide.id}
                        keyPrefix={mod.id}
                        steps={mod.steps}
                    />

                    {mod.variants?.length ? (
                        <VariantTabs
                            guideId={guide.id}
                            moduleId={mod.id}
                            variants={mod.variants}
                        />
                    ) : null}

                    {mod.checklist?.length ? <Checklist items={mod.checklist}/> : null}

                    {mod.commandGroups?.length ? <CommandGroups groups={mod.commandGroups}/> : null}
                </div>
            </div>
        </div>
    );
}
