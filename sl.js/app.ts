/// <reference path="app.models.ts" />
/// <reference path="app.http.ts" />
/// <reference path="app.endpoints.ts" />

/**
 * The base application that handles all primary SL.js functionality
 */
module SLjs {
    export class Application {
        config: Models.SLconfig;
        element: HTMLElement;
        firstMessageSent: boolean;

        constructor(config: Models.SLconfig) {
            this.config = config;
            this.element = document.getElementById(this.config.element);
            this.constructData();

            if (this.config.visitorName === null || this.config.visitorName === undefined) {
                // Show the name prompt
            } else {
                this.config.visitorName += ' (' + this.config.applicationName + ')';
                // Show the chat prompt
            }
        }

        /**
         * Does the initial work to get the application ready to send/receive messages, including
         * making sure that the user name and icon are set correctly
         */
        constructData() {
            if (this.config.useServerSideFeatures === null || this.config.useServerSideFeatures === undefined) {
                this.config.useServerSideFeatures = false;
            }

            if (this.config.visitorIcon === null || this.config.visitorIcon === undefined) {
                this.config.visitorIcon = ':red_circle:';
            }

            if (this.config.applicationName === null || this.config.applicationName === undefined) {
                this.config.applicationName = 'Visitor';
            }
        }

        /**
         * Sends the initial message to the support channel, including additional user information
         * @param message The text that you want to be sent into the channel
         */
        sendInitialMessage(message: string) {
            var userDataPoints: Models.SLAttachmentItem[] = [];

            if (!this.config.useServerSideFeatures) {
                userDataPoints.push({
                    title: 'First message for this visit to the channel',
                    text: 'Reply to me using !v1 [message]',
                    color: '#D00000'
                });
            }

            var packet: Models.SLAttachment = {
                attachments: userDataPoints,
                text: message,
                username: this.config.visitorName,
                icon_emoji: this.config.visitorIcon
            }

            Http.Action(packet, Endpoints.PostMessage, this.config);
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
                username: this.config.visitorName,
                icon_emoji: this.config.visitorIcon
            };

            Http.Action(packet, Endpoints.PostMessage, this.config);
        }
    }
}

//window.onload = () => {
//    var slConfig: SLjs.Models.SLconfig = {
//        token: '',
//        channel: '',
//        element: 'sl-app'
//    };

//    var sl = new SLjs.Application(slConfig);
//};