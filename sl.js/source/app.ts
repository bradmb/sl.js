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
    "use strict";

    export var Config: Models.ISLconfig;
    export var Users: Models.ISLSupportUser[] = <any>{};

    export class Application {
        firstMessageSent: boolean;

        constructor(config: Models.ISLconfig) {
            Config = config;
            this.constructData();

            Interface.ConstructInterface(document.getElementById(Config.element));

            if (Config.visitorName === null || Config.visitorName === undefined) {
                Interface.ConstructWelcomeWithName(function (visitorName: string) {
                    Config.visitorName = visitorName;
                    Interface.ConstructConversationWindow();
                });
            } else {
                Config.visitorName += " (" + Config.applicationName + ")";
                Interface.ConstructConversationWindow();

                var socket = new Socket();
                socket.GetWebSocketData(function (socketData: Models.ISLWebsocketAuthResponse) {
                    for (var user in socketData.users) {
                        if (socketData.users.hasOwnProperty(user)) {
                            var userData = socketData.users[user];
                            Users[userData.id] = {
                                name: userData.real_name !== "" ? userData.real_name : userData.name,
                                presence: userData.presence,
                                image: userData.profile.image_24
                            };
                        }
                    }

                    socket.ConnectWebSocket(socketData.url);
                });
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
                Config.visitorIcon = Strings.VISITOR_ICON;
            }

            if (Config.applicationName === null || Config.applicationName === undefined) {
                Config.applicationName = Strings.APP_NAME;
            }
        }

        /**
         * Sends the initial message to the support channel, including additional user information
         * @param message The text that you want to be sent into the channel
         */
        sendInitialMessage(message: string) {
            var userDataPoints: Models.ISLAttachmentItem[] = [];

            if (!Config.useServerSideFeatures) {
                userDataPoints.push({
                    title: Strings.FIRST_MESSAGE_HEADER,
                    text: Strings.MESSAGE_REPLY_HINT,
                    color: Strings.ATTACHMENT_COLOR
                });
            }

            var packet: Models.ISLAttachment = {
                attachments: userDataPoints,
                text: message,
                username: Config.visitorName,
                icon_emoji: Config.visitorIcon
            };

            Http.Action(packet, Endpoints.PostMessage);
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

            var packet: Models.ISLMessage = {
                text: message,
                username: Config.visitorName,
                icon_emoji: Config.visitorIcon
            };

            Http.Action(packet, Endpoints.PostMessage);
        }
    }
}