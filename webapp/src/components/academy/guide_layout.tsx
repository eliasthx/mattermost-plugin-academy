// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {routes} from 'content';
import React from 'react';
import {Link, NavLink} from 'react-router-dom';

import {GuideProvider, useGuideContext} from 'components/academy/guide_context';
import HeaderProgress from 'components/academy/header_progress';
import {AcademyIcon} from 'components/icons';

function GuideShell({children}: {children: React.ReactNode}) {
    const {guide, completed} = useGuideContext();
    const doneCount = Math.min(completed.size, guide.modules.length);

    return (
        <div className='academy-app__body'>
            <header className='academy-header'>
                <div
                    className='academy-header__texture'
                    aria-hidden={true}
                />
                <div className='academy-header__content'>
                    <Link
                        className='academy-header__back'
                        to={routes.catalog}
                    >
                        <AcademyIcon
                            name='arrow-left'
                            size={16}
                        />
                        {'All guides'}
                    </Link>
                    <div className='academy-header__title-row'>
                        <span className='academy-header__icon'>
                            <AcademyIcon
                                name={guide.icon}
                                size={32}
                            />
                        </span>
                        <h1 className='academy-header__title'>{guide.heroTitle}</h1>
                    </div>
                    <p className='academy-header__subtitle'>{guide.subtitle}</p>
                    <HeaderProgress
                        done={doneCount}
                        total={guide.modules.length}
                        label={`${doneCount} / ${guide.modules.length} modules complete`}
                    />
                </div>
            </header>

            <div className='academy-guide'>
                <nav
                    className='academy-guide__nav'
                    aria-label='Module navigation'
                >
                    <div className='academy-guide__nav-heading'>{'Modules'}</div>
                    {guide.modules.map((mod, index) => {
                        const done = completed.has(mod.id);
                        return (
                            <NavLink
                                key={mod.id}
                                to={routes.module(guide.id, mod.id)}
                                className={`academy-guide__nav-btn${done ? ' academy-guide__nav-btn--done' : ''}`}
                                activeClassName='academy-guide__nav-btn--active'
                                title={mod.navTitle}
                            >
                                <span className='academy-guide__nav-num'>
                                    {done ? (
                                        <AcademyIcon
                                            name='check'
                                            size={12}
                                        />
                                    ) : (
                                        index + 1
                                    )}
                                </span>
                                <span className='academy-guide__nav-label'>{mod.navTitle}</span>
                                {mod.minutes ? (
                                    <span className='academy-guide__nav-meta'>{`~${mod.minutes} min`}</span>
                                ) : null}
                            </NavLink>
                        );
                    })}
                </nav>
                <div className='academy-guide__main'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function GuideLayout({children}: {children: React.ReactNode}) {
    return (
        <GuideProvider>
            <GuideShell>
                {children}
            </GuideShell>
        </GuideProvider>
    );
}
