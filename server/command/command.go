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

const (
	helloCommandTrigger = "hello"
	learnCommandTrigger = "learn"
)

// Register all your slash commands in the NewCommandHandler function.
func NewCommandHandler(client *pluginapi.Client) Command {
	if err := client.SlashCommand.Register(&model.Command{
		Trigger:          helloCommandTrigger,
		AutoComplete:     true,
		AutoCompleteDesc: "Say hello to someone",
		AutoCompleteHint: "[@username]",
		AutocompleteData: model.NewAutocompleteData(helloCommandTrigger, "[@username]", "Username to say hello to"),
	}); err != nil {
		client.Log.Error("Failed to register command", "error", err)
	}

	if err := client.SlashCommand.Register(&model.Command{
		Trigger:          learnCommandTrigger,
		AutoComplete:     true,
		AutoCompleteDesc: "Open micro-learning guides",
		AutoCompleteHint: "",
		AutocompleteData: model.NewAutocompleteData(learnCommandTrigger, "", "Open the AI Quick Start guide"),
	}); err != nil {
		client.Log.Error("Failed to register command", "error", err)
	}

	return &Handler{
		client: client,
	}
}

// ExecuteCommand hook calls this method to execute the commands that were registered in the NewCommandHandler function.
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
	case helloCommandTrigger:
		return c.executeHelloCommand(args), nil
	case learnCommandTrigger:
		return c.executeLearnCommand(args), nil
	default:
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         fmt.Sprintf("Unknown command: %s", args.Command),
		}, nil
	}
}

func (c *Handler) executeHelloCommand(args *model.CommandArgs) *model.CommandResponse {
	if len(strings.Fields(args.Command)) < 2 {
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         "Please specify a username",
		}
	}
	username := strings.Fields(args.Command)[1]
	return &model.CommandResponse{
		Text: "Hello, " + username,
	}
}

func (c *Handler) executeLearnCommand(args *model.CommandArgs) *model.CommandResponse {
	siteURL := ""
	if cfg := c.client.Configuration.GetConfig(); cfg.ServiceSettings.SiteURL != nil {
		siteURL = strings.TrimRight(*cfg.ServiceSettings.SiteURL, "/")
	}

	team, err := c.client.Team.Get(args.TeamId)
	if err != nil || team == nil {
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         "Click **Learn** in the channel header to open the AI Quick Start guide.",
		}
	}

	channel, err := c.client.Channel.Get(args.ChannelId)
	if err != nil || channel == nil {
		return &model.CommandResponse{
			ResponseType: model.CommandResponseTypeEphemeral,
			Text:         "Click **Learn** in the channel header to open the AI Quick Start guide.",
		}
	}

	// Opens the in-channel learning overlay without leaving Channels chrome.
	learnURL := fmt.Sprintf("%s/%s/channels/%s?learn=1", siteURL, team.Name, channel.Name)
	return &model.CommandResponse{
		ResponseType: model.CommandResponseTypeEphemeral,
		Text:         fmt.Sprintf("Open the [AI Quick Start guide](%s)", learnURL),
	}
}
