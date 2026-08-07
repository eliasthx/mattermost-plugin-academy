// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {guideAssetURL, routes} from 'content';
import React, {useState} from 'react';
import {Link, Redirect, useHistory, useParams} from 'react-router-dom';

import {useGuideContext} from 'components/academy/guide_context';
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
    const [copied, setCopied] = useState<string | null>(null);

    const index = guide.modules.findIndex((m) => m.id === moduleId);
    if (index < 0) {
        return <Redirect to={routes.guide(guide.id)}/>;
    }

    const mod = guide.modules[index];
    const prev = index > 0 ? guide.modules[index - 1] : null;
    const next = index < guide.modules.length - 1 ? guide.modules[index + 1] : null;
    const isLast = !next;

    const onComplete = async () => {
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
    };

    const copyCommand = async (command: string) => {
        try {
            await navigator.clipboard.writeText(command);
            setCopied(command);
            window.setTimeout(() => setCopied(null), 1500);
        } catch {
            // ignore clipboard failures
        }
    };

    return (
        <div className='academy-module'>
            <div className='academy-module__scroll'>
                <div className='academy-module__content'>
                    <div className='academy-module__hero'>
                        <div className='academy-module__eyebrow'>
                            {`Module ${index + 1} of ${guide.modules.length}`}
                        </div>
                        <h2 className='academy-module__title'>{mod.title}</h2>
                        <p className='academy-module__summary'>{mod.summary}</p>
                    </div>

                    <div className='academy-module__steps'>
                        {mod.steps.map((step, stepIndex) => (
                            <div
                                className='academy-step'
                                key={`${mod.id}-${stepIndex}`}
                            >
                                <div className='academy-step__num'>{stepIndex + 1}</div>
                                <div className='academy-step__body'>
                                    <h3 className='academy-step__title'>{step.title}</h3>
                                    <p className='academy-step__desc'>
                                        <RichText text={step.description}/>
                                    </p>
                                    {step.media ? (
                                        <div className='academy-step__media'>
                                            <img
                                                src={guideAssetURL(guide.id, step.media.file)}
                                                alt={step.media.alt || ''}
                                            />
                                        </div>
                                    ) : null}
                                    {step.tip ? (
                                        <div className='academy-step__tip'>
                                            <RichText text={step.tip}/>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))}

                        {mod.commandGroups && mod.commandGroups.length > 0 ? (
                            <div className='academy-cmd'>
                                <div className='academy-cmd__hdr'>
                                    <span>{'Command'}</span>
                                    <span>{'What it does'}</span>
                                </div>
                                {mod.commandGroups.map((group) => (
                                    <div key={group.label}>
                                        <div className='academy-cmd__group-label'>{group.label}</div>
                                        {group.items.map((item) => (
                                            <div
                                                className='academy-cmd__item'
                                                key={item.command}
                                            >
                                                <button
                                                    type='button'
                                                    className='academy-cmd__try'
                                                    onClick={() => copyCommand(item.command)}
                                                    title='Copy command'
                                                >
                                                    <span>{item.command}</span>
                                                    <AcademyIcon
                                                        name={copied === item.command ? 'check' : 'content-copy'}
                                                        size={14}
                                                    />
                                                </button>
                                                <span className='academy-cmd__desc'>{item.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

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
        </div>
    );
}
