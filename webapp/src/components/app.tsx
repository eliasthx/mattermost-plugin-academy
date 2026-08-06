// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ACADEMY_BASE_PATH, getGuide, routes} from 'content';
import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import CatalogPage from 'components/academy/catalog_page';
import CompletionPage from 'components/academy/completion_page';
import GuideLayout from 'components/academy/guide_layout';
import GuideRedirect from 'components/academy/guide_redirect';
import ModulePage from 'components/academy/module_page';

import './app.scss';

function GuideRoutes() {
    return (
        <GuideLayout>
            <Switch>
                <Route
                    exact={true}
                    path='/guides/:guideId'
                    component={GuideRedirect}
                />
                <Route
                    exact={true}
                    path='/guides/:guideId/modules/:moduleId'
                    component={ModulePage}
                />
                <Route
                    exact={true}
                    path='/guides/:guideId/done'
                    component={CompletionPage}
                />
                <Redirect to={routes.catalog}/>
            </Switch>
        </GuideLayout>
    );
}

function GuideGate({children}: {children: React.ReactNode}) {
    return (
        <Route
            path='/guides/:guideId'
            render={({match}) => {
                if (!getGuide(match.params.guideId)) {
                    return <Redirect to={routes.catalog}/>;
                }
                return children;
            }}
        />
    );
}

// React 18 + @types/react-router-dom@5 omit `children` on router components.
const ProductRouter = BrowserRouter as unknown as React.ComponentType<{
    basename?: string;
    children?: React.ReactNode;
}>;

export default function App() {
    return (
        <div className='academy-app'>
            <ProductRouter basename={ACADEMY_BASE_PATH}>
                <Switch>
                    <Route
                        exact={true}
                        path='/'
                        component={CatalogPage}
                    />
                    <GuideGate>
                        <GuideRoutes/>
                    </GuideGate>
                    <Redirect to={routes.catalog}/>
                </Switch>
            </ProductRouter>
        </div>
    );
}
