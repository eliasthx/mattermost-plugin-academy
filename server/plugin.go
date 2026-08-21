// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin"
	"github.com/mattermost/mattermost/server/public/pluginapi"

	"github.com/esethna/mm-academy/server/command"
	"github.com/esethna/mm-academy/server/progress"
)

// Plugin implements the interface expected by the Mattermost server.
type Plugin struct {
	plugin.MattermostPlugin

	client          *pluginapi.Client
	commandClient   command.Command
	progressHandler *progress.Handler

	configurationLock sync.RWMutex
	configuration     *configuration
}

// OnActivate is invoked when the plugin is activated.
func (p *Plugin) OnActivate() error {
	p.client = pluginapi.NewClient(p.API, p.Driver)
	p.commandClient = command.NewCommandHandler(p.client)
	p.progressHandler = progress.NewHandler(progress.NewStore(p.client), p)
	return nil
}

// GuideEnabled implements progress.Policy.
func (p *Plugin) GuideEnabled(guideID string) bool {
	return p.getConfiguration().guideEnabled(guideID)
}

// ProfileBadgesEnabled implements progress.Policy.
func (p *Plugin) ProfileBadgesEnabled() bool {
	return p.getConfiguration().profileBadgesEnabled()
}

// ExecuteCommand runs registered slash commands (currently /learn).
func (p *Plugin) ExecuteCommand(_ *plugin.Context, args *model.CommandArgs) (*model.CommandResponse, *model.AppError) {
	response, err := p.commandClient.Handle(args)
	if err != nil {
		return nil, model.NewAppError("ExecuteCommand", "plugin.command.execute_command.app_error", nil, err.Error(), http.StatusInternalServerError)
	}
	return response, nil
}

// ServeHTTP handles plugin HTTP routes (progress API). Static public/ files are
// served by the Mattermost server separately.
func (p *Plugin) ServeHTTP(_ *plugin.Context, w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/api/v1/settings" {
		p.serveSettings(w, r)
		return
	}
	if strings.HasPrefix(r.URL.Path, "/api/v1/admin/") {
		p.progressHandler.ServeAdminHTTP(w, r)
		return
	}
	if strings.HasPrefix(r.URL.Path, "/api/v1/progress") {
		userID := r.Header.Get("Mattermost-User-Id")
		if userID == "" {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		if !p.userHasAccess(userID) {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		p.progressHandler.ServeHTTP(w, r)
		return
	}
	if strings.HasPrefix(r.URL.Path, "/api/v1/users/") {
		p.progressHandler.ServeHTTP(w, r)
		return
	}
	http.NotFound(w, r)
}

func (p *Plugin) serveSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := r.Header.Get("Mattermost-User-Id")
	if userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	cfg := p.getConfiguration()
	disabled := cfg.disabledGuideIDs()
	if disabled == nil {
		disabled = []string{}
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"enableProfileBadges": cfg.profileBadgesEnabled(),
		"userAllowed":         p.userHasAccess(userID),
		"disabledGuideIDs":    disabled,
		"isAdmin":             p.userIsAdmin(userID),
		"activePluginIDs":     p.activePluginIDs(),

		"showAdminGuidesToAllUsers": cfg.showAdminGuidesToAllUsers(),
	})
}

// userIsAdmin reports whether the user can administer the system.
func (p *Plugin) userIsAdmin(userID string) bool {
	if p.client == nil {
		return false
	}
	return p.client.User.HasPermissionTo(userID, model.PermissionManageSystem)
}

// activePluginIDs lists plugins that are currently running, used by the webapp
// to hide guides for features that aren't available. GetPlugins already
// excludes installed-but-disabled plugins.
//
// Fails open: an error returns nil, and the webapp treats an absent list as
// "no filtering" so a lookup failure can never hide a guide.
func (p *Plugin) activePluginIDs() []string {
	if p.API == nil {
		return nil
	}
	manifests, appErr := p.API.GetPlugins()
	if appErr != nil {
		p.API.LogWarn("failed to list active plugins", "err", appErr.Error())
		return nil
	}
	ids := make([]string, 0, len(manifests))
	for _, m := range manifests {
		if m != nil {
			ids = append(ids, m.Id)
		}
	}
	return ids
}
