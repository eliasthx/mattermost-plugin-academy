package command

import (
	"fmt"
	"strings"

	"github.com/mattermost/mattermost/server/public/model"
	"github.com/mattermost/mattermost/server/public/pluginapi"
)

type Handler struct {
	client *pluginapi.Client
}

type Command interface {
	Handle(args *model.CommandArgs) (*model.CommandResponse, error)
}

const learnCommandTrigger = "learn"

func NewCommandHandler(client *pluginapi.Client) Command {
	if err := client.SlashCommand.Register(&model.Command{
		Trigger:          learnCommandTrigger,
		AutoComplete:     true,
		AutoCompleteDesc: "Mattermost Academy",
		AutoCompleteHint: "",
		AutocompleteData: model.NewAutocompleteData(learnCommandTrigger, "", "Mattermost Academy"),
	}); err != nil {
		client.Log.Error("Failed to register command", "error", err)
	}

	return &Handler{
		client: client,
	}
}

func (c *Handler) Handle(args *model.CommandArgs) (*model.CommandResponse, error) {
	fields := strings.Fields(args.Command)
	if len(fields) == 0 {
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         "Empty command",
		}, nil
	}

	trigger := strings.TrimPrefix(fields[0], "/")
	switch trigger {
	case learnCommandTrigger:
		return c.executeLearnCommand(args), nil
	default:
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         fmt.Sprintf("Unknown command: %s", args.Command),
		}, nil
	}
}

func (c *Handler) executeLearnCommand(args *model.CommandArgs) *model.CommandResponse {
	siteURL := ""
	if cfg := c.client.Configuration.GetConfig(); cfg.ServiceSettings.SiteURL != nil {
		siteURL = strings.TrimRight(*cfg.ServiceSettings.SiteURL, "/")
	}

	fallback := &model.CommandResponse{
		ResponseType: model.CommandResponseTypeEphemeral,
		Text:         "Click **Mattermost Academy** in the channel header or App Bar to open the guide.",
	}

	team, err := c.client.Team.Get(args.TeamId)
	if err != nil || team == nil {
		return fallback
	}

	channel, err := c.client.Channel.Get(args.ChannelId)
	if err != nil || channel == nil {
		return fallback
	}

	// Opens the in-channel learning overlay without leaving Channels chrome.
	learnURL := fmt.Sprintf("%s/%s/channels/%s?learn=1", siteURL, team.Name, channel.Name)
	return &model.CommandResponse{
		ResponseType: model.CommandResponseTypeEphemeral,
		Text:         fmt.Sprintf("Open [Mattermost Academy](%s)", learnURL),
	}
}
