/// <reference path="app.models.ts" />
/// <reference path="app.http.ts" />
/// <reference path="app.endpoints.ts" />
/// <reference path="app.interface.ts" />
/// <reference path="app.parameters.ts" />
/// <reference path="app.strings.ts" />
/// <reference path="app.settings.ts" />

/**
 * The base application that handles all primary SL.js functionality
 */
module SLjs {
    export class Application {
        firstMessageSent: boolean;

        constructor(config: Models.SLconfig) {
            settings.config = config;
            settings.parentElement = document.getElementById(settings.config.element);

            Interface.ConstructInterface();
            this.constructData();

            if (settings.config.visitorName === null || settings.config.visitorName === undefined) {
                Interface.ConstructWelcomeWithName(function (visitorName: string) {
                    console.log(visitorName);
                });
            } else {
                settings.config.visitorName += ' (' + settings.config.applicationName + ')';
                // Show the chat prompt
            }
        }

        /**
         * Does the initial work to get the application ready to send/receive messages, including
         * making sure that the user name and icon are set correctly
         */
        constructData() {
            if (settings.config.useServerSideFeatures === null || settings.config.useServerSideFeatures === undefined) {
                settings.config.useServerSideFeatures = false;
            }

            if (settings.config.visitorIcon === null || settings.config.visitorIcon === undefined) {
                settings.config.visitorIcon = ':red_circle:';
            }

            if (settings.config.applicationName === null || settings.config.applicationName === undefined) {
                settings.config.applicationName = 'SL.js';
            }
        }

        /**
         * Sends the initial message to the support channel, including additional user information
         * @param message The text that you want to be sent into the channel
         */
        sendInitialMessage(message: string) {
            var userDataPoints: Models.SLAttachmentItem[] = [];

            if (!settings.config.useServerSideFeatures) {
                userDataPoints.push({
                    title: 'First message for this visit to the channel',
                    text: 'Reply to me using !v1 [message]',
                    color: '#D00000'
                });
            }

            var packet: Models.SLAttachment = {
                attachments: userDataPoints,
                text: message,
                username: settings.config.visitorName,
                icon_emoji: settings.config.visitorIcon
            }

            Http.Action(packet, Endpoints.PostMessage, settings.config);
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
                username: settings.config.visitorName,
                icon_emoji: settings.config.visitorIcon
            };

            Http.Action(packet, Endpoints.PostMessage, settings.config);
        }
    }
}