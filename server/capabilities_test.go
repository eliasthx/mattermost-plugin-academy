// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package main

import (
	"net/http"
	"testing"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin/plugintest"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestActivePluginIDs(t *testing.T) {
	t.Run("returns ids of active plugins", func(t *testing.T) {
		api := &plugintest.API{}
		api.On("GetPlugins").Return([]*model.Manifest{
			{Id: "playbooks"},
			{Id: "focalboard"},
		}, nil)

		p := &Plugin{}
		p.SetAPI(api)

		assert.Equal(t, []string{"playbooks", "focalboard"}, p.activePluginIDs())
	})

	t.Run("fails open when the lookup errors", func(t *testing.T) {
		api := &plugintest.API{}
		api.On("GetPlugins").Return(nil, model.NewAppError("GetPlugins", "boom", nil, "", http.StatusInternalServerError))
		api.On("LogWarn", mock.Anything, mock.Anything, mock.Anything).Return()

		p := &Plugin{}
		p.SetAPI(api)

		// nil rather than an empty slice: the webapp treats absent as "no filtering".
		assert.Nil(t, p.activePluginIDs())
	})

	t.Run("no API available", func(t *testing.T) {
		p := &Plugin{}
		assert.Nil(t, p.activePluginIDs())
	})

	t.Run("skips nil manifests", func(t *testing.T) {
		api := &plugintest.API{}
		api.On("GetPlugins").Return([]*model.Manifest{nil, {Id: "mattermost-ai"}}, nil)

		p := &Plugin{}
		p.SetAPI(api)

		assert.Equal(t, []string{"mattermost-ai"}, p.activePluginIDs())
	})
}

func TestUserIsAdmin(t *testing.T) {
	t.Run("false when client is not initialised", func(t *testing.T) {
		p := &Plugin{}
		assert.False(t, p.userIsAdmin("user1"))
	})
}
