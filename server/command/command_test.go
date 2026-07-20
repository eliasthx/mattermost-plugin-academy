package command

import (
	"testing"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/plugin/plugintest"
	"github.com/mattermost/mattermost/server/public/pluginapi"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

type env struct {
	client *pluginapi.Client
	api    *plugintest.API
}

func setupTest() *env {
	api := &plugintest.API{}
	driver := &plugintest.Driver{}
	client := pluginapi.NewClient(api, driver)

	api.On("RegisterCommand", mock.Anything).Return(nil)

	return &env{
		client: client,
		api:    api,
	}
}

func TestLearnCommand(t *testing.T) {
	assert := assert.New(t)
	env := setupTest()

	siteURL := "http://localhost:8065"
	env.api.On("GetConfig").Return(&model.Config{
		ServiceSettings: model.ServiceSettings{
			SiteURL: &siteURL,
		},
	})
	env.api.On("GetTeam", "team-id").Return(&model.Team{
		Id:   "team-id",
		Name: "es-test",
	}, nil)
	env.api.On("GetChannel", "channel-id").Return(&model.Channel{
		Id:   "channel-id",
		Name: "off-topic",
	}, nil)

	cmdHandler := NewCommandHandler(env.client)

	response, err := cmdHandler.Handle(&model.CommandArgs{
		Command:   "/learn",
		TeamId:    "team-id",
		ChannelId: "channel-id",
	})
	assert.Nil(err)
	assert.Equal(model.CommandResponseTypeEphemeral, response.ResponseType)
	assert.Contains(response.Text, "http://localhost:8065/es-test/channels/off-topic?learn=1")
	assert.Contains(response.Text, "Mattermost Academy")
}
