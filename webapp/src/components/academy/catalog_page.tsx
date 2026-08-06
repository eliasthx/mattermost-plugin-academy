// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchAllProgress} from 'client/progress';
import type {ProgressRecord} from 'client/progress';
import {GUIDE_LIST, routes} from 'content';
import type {Audience} from 'content/types';
import React, {useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router-dom';

import {AcademyIcon} from 'components/icons';

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
                <div className='academy-header__content'>
                    <h1 className='academy-header__title'>{'Learn Mattermost by doing'}</h1>
                    <p className='academy-header__subtitle'>
                        {'Earn a badge for completing short walk-through guides that help you get more done in Mattermost.'}
                    </p>
                    <p className='academy-header__subtitle'>
                        {`${completedGuides} / ${GUIDE_LIST.length} guides complete`}
                    </p>
                </div>
            </header>

            <div className='academy-catalog'>
                <div className='academy-catalog__content'>
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

                    <div className='academy-catalog__label'>{'Available guides'}</div>

                    {guides.length === 0 ? (
                        <p className='academy-catalog__empty'>{'No guides match this filter.'}</p>
                    ) : (
                        <div className='academy-catalog__grid'>
                            {guides.map((guide) => {
                                const done = completedCount(progress[guide.id], guide.modules.length);
                                const pct = guide.modules.length ? Math.round((done / guide.modules.length) * 100) : 0;
                                let cta = 'Start';
                                if (progress[guide.id]?.everCompleted) {
                                    cta = 'Review';
                                } else if (done > 0) {
                                    cta = 'Continue';
                                }
                                return (
                                    <Link
                                        key={guide.id}
                                        className='academy-card'
                                        to={routes.guide(guide.id)}
                                    >
                                        <span className='academy-card__icon'>
                                            <AcademyIcon
                                                name={guide.icon}
                                                size={22}
                                            />
                                        </span>
                                        <h2 className='academy-card__title'>{guide.title}</h2>
                                        <p className='academy-card__desc'>{guide.description}</p>
                                        <div
                                            className='academy-card__progress'
                                            aria-hidden={true}
                                        >
                                            <div
                                                className='academy-card__progress-bar'
                                                style={{width: `${pct}%`}}
                                            />
                                        </div>
                                        <div className='academy-card__footer'>
                                            <span>{`${done} / ${guide.modules.length} modules`}</span>
                                            <span className='academy-card__cta'>
                                                {cta}
                                                <AcademyIcon
                                                    name='chevron_right'
                                                    size={16}
                                                />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
