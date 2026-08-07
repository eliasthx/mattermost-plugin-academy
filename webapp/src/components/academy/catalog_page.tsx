// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchAllProgress} from 'client/progress';
import type {ProgressRecord} from 'client/progress';
import {GUIDE_LIST} from 'content';
import type {Audience} from 'content/types';
import React, {useEffect, useMemo, useState} from 'react';

import GuideCard, {guideCardCta} from 'components/academy/guide_card';
import HeaderProgress from 'components/academy/header_progress';
import {AcademyIcon, AcademyProductIcon} from 'components/icons';
import {navigateToChannels} from 'navigation';

type Filter = 'all' | Audience;

function completedCount(rec: ProgressRecord | undefined, moduleCount: number) {
    if (!rec) {
        return 0;
    }
    return Math.min(rec.completedModuleIds?.length || 0, moduleCount);
}

export default function CatalogPage() {
    const [filter, setFilter] = useState<Filter>('all');
    const [progress, setProgress] = useState<Record<string, ProgressRecord>>({});

    useEffect(() => {
        let cancelled = false;
        fetchAllProgress().
            then((guides) => {
                if (!cancelled) {
                    setProgress(guides);
                }
            }).
            catch(() => {
                if (!cancelled) {
                    setProgress({});
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const guides = useMemo(() => {
        if (filter === 'all') {
            return GUIDE_LIST;
        }
        return GUIDE_LIST.filter((g) => g.audiences.includes(filter));
    }, [filter]);

    const completedGuides = GUIDE_LIST.filter((g) => progress[g.id]?.everCompleted).length;

    return (
        <div className='academy-app__body'>
            <header className='academy-header'>
                <div
                    className='academy-header__texture'
                    aria-hidden={true}
                />
                <div className='academy-header__content'>
                    <button
                        type='button'
                        className='academy-header__back'
                        onClick={() => navigateToChannels()}
                    >
                        <AcademyIcon
                            name='arrow-left'
                            size={16}
                        />
                        {'Back to channels'}
                    </button>
                    <div className='academy-header__title-row'>
                        <span className='academy-header__icon'>
                            <AcademyProductIcon size={32}/>
                        </span>
                        <h1 className='academy-header__title'>{'Quick start guides'}</h1>
                    </div>
                    <p className='academy-header__subtitle'>
                        {'Earn a badge for completing short walk-through guides that help you get more done in Mattermost.'}
                    </p>
                    <HeaderProgress
                        done={completedGuides}
                        total={GUIDE_LIST.length}
                        label={`${completedGuides} / ${GUIDE_LIST.length} guides complete`}
                    />
                </div>
            </header>

            <div className='academy-catalog'>
                <div className='academy-catalog__content'>
                    <div className='academy-catalog__toolbar'>
                        <div className='academy-catalog__label'>{'Available guides'}</div>
                        <div
                            className='academy-catalog__filters'
                            role='group'
                            aria-label='Filter guides by audience'
                        >
                            {([
                                ['all', 'All'],
                                ['end-user', 'End users'],
                                ['admin', 'Admins'],
                            ] as Array<[Filter, string]>).map(([id, label]) => (
                                <button
                                    key={id}
                                    type='button'
                                    className={`academy-catalog__chip${filter === id ? ' academy-catalog__chip--active' : ''}`}
                                    onClick={() => setFilter(id)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {guides.length === 0 ? (
                        <p className='academy-catalog__empty'>{'No guides match this filter.'}</p>
                    ) : (
                        <div className='academy-catalog__grid'>
                            {guides.map((guide) => {
                                const done = completedCount(progress[guide.id], guide.modules.length);
                                return (
                                    <GuideCard
                                        key={guide.id}
                                        guide={guide}
                                        done={done}
                                        cta={guideCardCta(done, progress[guide.id]?.everCompleted)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
