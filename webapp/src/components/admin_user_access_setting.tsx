// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';

import type {PluginCustomSettingsComponentProps} from 'types/mattermost-webapp';

import {
    DEFAULT_USER_ACCESS_CONFIG,
    normalizeUserAccessConfig,
    UserAccessLevel,
    type UserAccessConfig,
} from 'admin/user_access';
import {GUIDE_LIST} from 'content';
import {pluginLabel} from 'content/plugins';
import type {Guide} from 'content/types';
import {useActivePluginIDs} from 'hooks/use_active_plugins';

import SelectUser from './select_user';

import './admin_user_access_setting.scss';

type Props = PluginCustomSettingsComponentProps<UserAccessConfig | string | null | undefined>;

function forEditor(value: UserAccessConfig): UserAccessConfig {
    // Block/None are no longer offered; keep any saved list under Allow.
    if (value.userAccessLevel === UserAccessLevel.Block || value.userAccessLevel === UserAccessLevel.None) {
        return {...value, userAccessLevel: UserAccessLevel.Allow};
    }
    return value;
}

/**
 * Names the plugins a guide needs that are not currently running. Returns an
 * empty list while the active set is unknown, so a failed lookup does not
 * claim a guide is broken.
 */
function missingPlugins(guide: Guide, activePluginIDs: string[] | null): string[] {
    if (!guide.requiresPlugins || activePluginIDs === null) {
        return [];
    }
    return guide.requiresPlugins.filter((id) => !activePluginIDs.includes(id));
}

export default function AdminUserAccessSetting(props: Props) {
    const activePluginIDs = useActivePluginIDs();
    const value = useMemo(
        () => forEditor(normalizeUserAccessConfig(props.value ?? DEFAULT_USER_ACCESS_CONFIG)),
        [props.value],
    );

    const update = (next: UserAccessConfig) => {
        props.onChange(props.id, next);
        props.setSaveNeeded();
    };

    const setGuideEnabled = (guideID: string, enabled: boolean) => {
        const disabled = new Set(value.disabledGuideIDs);
        if (enabled) {
            disabled.delete(guideID);
        } else {
            disabled.add(guideID);
        }
        update({...value, disabledGuideIDs: Array.from(disabled).sort()});
    };

    return (
        <div className='AcademyUserAccessSetting'>
            <div className='AcademyUserAccessSetting__label'>{'Users'}</div>
            <div className='AcademyUserAccessSetting__control'>
                <div className='AcademyUserAccessSetting__help'>
                    {'Select who can open Academy and complete guides. Users who are not allowed will not see Academy in the product interface.'}
                </div>
                <div className='AcademyUserAccessSetting__radios'>
                    <input
                        type='radio'
                        id={`${props.id}-all`}
                        name={`${props.id}-level`}
                        checked={value.userAccessLevel === UserAccessLevel.All}
                        disabled={props.disabled}
                        onChange={() => update({...value, userAccessLevel: UserAccessLevel.All})}
                    />
                    <label htmlFor={`${props.id}-all`}>{'Allow for all users'}</label>
                    <input
                        type='radio'
                        id={`${props.id}-allow`}
                        name={`${props.id}-level`}
                        checked={value.userAccessLevel === UserAccessLevel.Allow}
                        disabled={props.disabled}
                        onChange={() => update({...value, userAccessLevel: UserAccessLevel.Allow})}
                    />
                    <label htmlFor={`${props.id}-allow`}>{'Allow for selected users'}</label>
                </div>
                {value.userAccessLevel === UserAccessLevel.Allow && (
                    <div className='AcademyUserAccessSetting__list'>
                        <div className='AcademyUserAccessSetting__listLabel'>{'Allow list'}</div>
                        <SelectUser
                            userIDs={value.userIDs}
                            teamIDs={value.teamIDs}
                            disabled={props.disabled}
                            onChangeIDs={(userIDs, teamIDs) => update({...value, userIDs, teamIDs})}
                        />
                        <div className='AcademyUserAccessSetting__help'>
                            {'Enter users to allow for Academy'}
                        </div>
                    </div>
                )}
            </div>

            <div className='AcademyUserAccessSetting__label'>{'Admin guides'}</div>
            <div className='AcademyUserAccessSetting__control'>
                <div className='AcademyUserAccessSetting__help'>
                    {'Guides written for system admins walk through the System Console. They are hidden from everyone else unless you turn this on.'}
                </div>
                <div className='AcademyUserAccessSetting__guides'>
                    <input
                        type='checkbox'
                        id={`${props.id}-admin-guides`}
                        checked={value.showAdminGuidesToAllUsers}
                        disabled={props.disabled}
                        onChange={(e) => update({...value, showAdminGuidesToAllUsers: e.target.checked})}
                    />
                    <label htmlFor={`${props.id}-admin-guides`}>
                        {'Show admin guides to all users'}
                    </label>
                </div>
            </div>

            <div className='AcademyUserAccessSetting__label'>{'Guides'}</div>
            <div className='AcademyUserAccessSetting__control'>
                <div className='AcademyUserAccessSetting__help'>
                    {'Choose which guides are available to users in Academy.'}
                </div>
                <div className='AcademyUserAccessSetting__guides'>
                    {GUIDE_LIST.map((guide) => {
                        const enabled = !value.disabledGuideIDs.includes(guide.id);
                        const inputId = `${props.id}-guide-${guide.id}`;
                        const missing = missingPlugins(guide, activePluginIDs);
                        return (
                            <React.Fragment key={guide.id}>
                                <input
                                    type='checkbox'
                                    id={inputId}
                                    checked={enabled}
                                    disabled={props.disabled}
                                    onChange={(e) => setGuideEnabled(guide.id, e.target.checked)}
                                />
                                <label htmlFor={inputId}>
                                    {guide.title}
                                    {missing.length > 0 && (
                                        <span className='AcademyUserAccessSetting__requires'>
                                            {`Hidden: needs ${missing.map(pluginLabel).join(' and ')}. `}
                                            <a
                                                href='/admin_console/plugins/plugin_management'
                                                rel='noreferrer'
                                            >
                                                {'Manage plugins'}
                                            </a>
                                        </span>
                                    )}
                                </label>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
