// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

package main

import (
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
	p.progressHandler = progress.NewHandler(progress.NewStore(p.client))
	return nil
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
	if strings.HasPrefix(r.URL.Path, "/api/v1/progress") {
		p.progressHandler.ServeHTTP(w, r)
		return
	}
	http.NotFound(w, r)
}
