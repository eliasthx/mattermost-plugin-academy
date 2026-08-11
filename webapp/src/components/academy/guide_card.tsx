// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {routes} from 'content';
import type {Guide} from 'content/types';
import React from 'react';
import {Link} from 'react-router-dom';

import {AcademyIcon} from 'components/icons';

type GuideCardProps = {
    guide: Guide;
    done: number;
    cta: string;
    onClick?: () => void;
    compact?: boolean;
};

function GuideCardBody({guide, done, cta, compact}: GuideCardProps) {
    const pct = guide.modules.length ? Math.round((done / guide.modules.length) * 100) : 0;
    const iconSize = compact ? 22 : 32;

    return (
        <>
            <div className='academy-card__heading'>
                <span className='academy-card__icon'>
                    <AcademyIcon
                        name={guide.icon}
                        size={iconSize}
                    />
                </span>
                <h2 className='academy-card__title'>{guide.title}</h2>
            </div>
            <p className='academy-card__desc'>{guide.description}</p>
            <div className='academy-card__footer'>
                <span>{`${done} / ${guide.modules.length} modules`}</span>
                <span className='academy-card__cta'>
                    {cta}
                    <AcademyIcon
                        name='chevron-right'
                        size={16}
                    />
                </span>
            </div>
            <div
                className='academy-card__progress'
                aria-hidden={true}
            >
                <div
                    className='academy-card__progress-bar'
                    style={{width: `${pct}%`}}
                />
            </div>
        </>
    );
}

/** Catalog / RHS guide card — Link in-product, button when navigating from host RHS. */
export default function GuideCard({guide, done, cta, onClick, compact}: GuideCardProps) {
    const className = compact ? 'academy-card academy-card--compact' : 'academy-card';
    const body = (
        <GuideCardBody
            guide={guide}
            done={done}
            cta={cta}
            compact={compact}
        />
    );

    if (onClick) {
        return (
            <button
                type='button'
                className={className}
                onClick={onClick}
            >
                {body}
            </button>
        );
    }

    return (
        <Link
            className={className}
            to={routes.guide(guide.id)}
        >
            {body}
        </Link>
    );
}

export function guideCardCta(done: number, everCompleted?: boolean) {
    if (everCompleted) {
        return 'Review';
    }
    if (done > 0) {
        return 'Continue';
    }
    return 'Start';
}
