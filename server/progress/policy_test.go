// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package progress

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

type stubPolicy struct {
	guideEnabled  bool
	badgesEnabled bool
}

func (s stubPolicy) GuideEnabled(string) bool   { return s.guideEnabled }
func (s stubPolicy) ProfileBadgesEnabled() bool { return s.badgesEnabled }

// The denied paths below all return before touching the store, so a nil store
// is enough and keeps these tests free of plugin API mocks.
func handlerWith(policy Policy) *Handler {
	return NewHandler(nil, policy)
}

func request(method, path string) *http.Request {
	r := httptest.NewRequest(method, path, strings.NewReader(`{}`))
	r.Header.Set("Mattermost-User-Id", "user1")
	return r
}

func TestPutRejectedForDisabledGuide(t *testing.T) {
	w := httptest.NewRecorder()
	handlerWith(stubPolicy{guideEnabled: false}).ServeHTTP(w, request(http.MethodPut, "/api/v1/progress/slash-commands"))

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "guide is not available")
}

func TestCompletionsRejectedWhenBadgesDisabled(t *testing.T) {
	w := httptest.NewRecorder()
	handlerWith(stubPolicy{badgesEnabled: false}).ServeHTTP(w, request(http.MethodGet, "/api/v1/users/abc123/completions"))

	assert.Equal(t, http.StatusForbidden, w.Code)
	assert.Contains(t, w.Body.String(), "profile badges are disabled")
}

func TestUnauthenticatedRequestsRejectedBeforePolicy(t *testing.T) {
	w := httptest.NewRecorder()
	r := httptest.NewRequest(http.MethodGet, "/api/v1/progress", nil)
	handlerWith(stubPolicy{guideEnabled: true, badgesEnabled: true}).ServeHTTP(w, r)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
