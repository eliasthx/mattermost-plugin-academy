// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package progress

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNormalizeIDs(t *testing.T) {
	assert.Equal(t, []string{"a", "b"}, normalizeIDs([]string{" b ", "a", "b", "", "a"}))
}

func TestContainsAll(t *testing.T) {
	assert.False(t, containsAll([]string{"a"}, nil))
	assert.False(t, containsAll([]string{"a"}, []string{}))
	assert.True(t, containsAll([]string{"a", "b", "c"}, []string{"c", "a"}))
	assert.False(t, containsAll([]string{"a", "b"}, []string{"a", "c"}))
}

func TestValidGuideID(t *testing.T) {
	assert.True(t, validGuideID("ai-quick-start"))
	assert.True(t, validGuideID("slash_command_1"))
	assert.False(t, validGuideID(""))
	assert.False(t, validGuideID("../x"))
	assert.False(t, validGuideID("AI"))
}

func TestValidUserID(t *testing.T) {
	assert.True(t, validUserID("abcdefghijklmnopqrstuvwxyz"))
	assert.True(t, validUserID("UserID123"))
	assert.False(t, validUserID(""))
	assert.False(t, validUserID("user-id"))
	assert.False(t, validUserID("../x"))
}

func TestPutRequestCompleteness(t *testing.T) {
	// Pure helper coverage for curriculum completeness rules used by Put.
	have := normalizeIDs([]string{"ai-chat", "summarize-threads"})
	need := normalizeIDs([]string{"summarize-threads", "ai-chat", "ai-search"})
	require.False(t, containsAll(have, need))

	have = normalizeIDs(append(have, "ai-search"))
	require.True(t, containsAll(have, need))
}
