// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package main

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestTruthyUnmarshal(t *testing.T) {
	cases := []struct {
		raw      string
		want     Truthy
		wantErr  bool
	}{
		{`true`, true, false},
		{`false`, false, false},
		{`"true"`, true, false},
		{`"false"`, false, false},
		{`"TRUE"`, true, false},
		{`""`, false, false},
		{`"nope"`, false, true},
	}
	for _, tc := range cases {
		var got Truthy
		err := json.Unmarshal([]byte(tc.raw), &got)
		if tc.wantErr {
			require.Error(t, err, tc.raw)
			continue
		}
		require.NoError(t, err, tc.raw)
		assert.Equal(t, tc.want, got, tc.raw)
	}
}

func TestProfileBadgesEnabledDefaults(t *testing.T) {
	assert.True(t, (*configuration)(nil).profileBadgesEnabled())
	assert.True(t, (&configuration{}).profileBadgesEnabled())

	on := Truthy(true)
	off := Truthy(false)
	assert.True(t, (&configuration{EnableProfileBadges: &on}).profileBadgesEnabled())
	assert.False(t, (&configuration{EnableProfileBadges: &off}).profileBadgesEnabled())
}

func TestLoadEnableProfileBadgesFromMattermostDefaultString(t *testing.T) {
	// Mattermost LoadPluginConfiguration lowercases keys and uses schema default strings.
	raw := `{"enableprofilebadges":"true"}`
	cfg := new(configuration)
	require.NoError(t, json.Unmarshal([]byte(raw), cfg))
	require.NotNil(t, cfg.EnableProfileBadges)
	assert.True(t, cfg.profileBadgesEnabled())
}
