/// <reference path="app.models.ts" />
/// <reference path="app.http.ts" />
/// <reference path="app.endpoints.ts" />
/// <reference path="app.interface.ts" />
/// <reference path="app.parameters.ts" />
/// <reference path="app.strings.ts" />

/**
 * The base application that handles all primary SL.js functionality
 */
module SLjs {
    export var Config: Models.SLconfig;

    export class Application {
        firstMessageSent: boolean;

        constructor(config: Models.SLconfig) {
            Config = config;
            this.constructData();

            Interface.ConstructInterface(document.getElementById(Config.element));

            if (Config.visitorName === null || Config.visitorName === undefined) {
                Interface.ConstructWelcomeWithName(function (visitorName: string) {
                    Config.visitorName = visitorName;
                    Interface.ConstructConversationWindow();
                });
            } else {
                Config.visitorName += ' (' + Config.applicationName + ')';
                Interface.ConstructConversationWindow();
            }
        }

        /**
         * Does the initial work to get the application ready to send/receive messages, including
         * making sure that the user name and icon are set correctly
         */
        constructData() {
            if (Config.useServerSideFeatures === null || Config.useServerSideFeatures === undefined) {
                Config.useServerSideFeatures = false;
            }

            if (Config.visitorIcon === null || Config.visitorIcon === undefined) {
                Config.visitorIcon = ':red_circle:';
            }

            if (Config.applicationName === null || Config.applicationName === undefined) {
                Config.applicationName = 'SL.js';
            }
        }

        /**
         * Sends the initial message to the support channel, including additional user information
         * @param message The text that you want to be sent into the channel
         */
        sendInitialMessage(message: string) {
            var userDataPoints: Models.SLAttachmentItem[] = [];

            if (!Config.useServerSideFeatures) {
                userDataPoints.push({
                    title: 'First message for this visit to the channel',
                    text: 'Reply to me using !v1 [message]',
                    color: '#D00000'
                });
            }

            var packet: Models.SLAttachment = {
                attachments: userDataPoints,
                text: message,
                username: Config.visitorName,
                icon_emoji: Config.visitorIcon
            }

            Http.Action(packet, Endpoints.PostMessage, Config);
        }

        /**
         * Sends a standard message to the support channel
         * @param message The text that you want to be sent into the channel
         */
        sendMessage(message: string) {
            if (!this.firstMessageSent) {
                this.firstMessageSent = true;
                this.sendInitialMessage(message);

                return;
            }

            var packet: Models.SLMessage = {
                text: message,
                username: Config.visitorName,
                icon_emoji: Config.visitorIcon
            };

            Http.Action(packet, Endpoints.PostMessage, Config);
        }
    }
}