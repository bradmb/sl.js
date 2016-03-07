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

    export var VisitorId: string;
    export var Config: Models.ISLConfig = { applicationName: Strings.APP_NAME, channel: null, element: null, token: null };
    export var Users: Models.ISLSupportUser[] = <any>{};

    export class Application {
        constructor(config: Models.ISLConfig) {
            Config = config;
            this.constructData();

            Interface.ConstructInterface(document.getElementById(Config.element));

            if (Config.visitorName === null || Config.visitorName === undefined) {
                Interface.ConstructWelcomeWithName(function (visitorName: string) {
                    Config.visitorName = visitorName;
                    Interface.ConstructConversationWindow();

                    var socket = new Socket();
                    socket.GetWebSocketData(function (webSocketUrl: string) {
                        socket.ConnectWebSocket(webSocketUrl);
                    });
                });
            } else {
                Config.visitorName = "[" + VisitorId + "] " + Config.visitorName + " (" + Config.applicationName + ")";
                Interface.ConstructConversationWindow();

                var socket = new Socket();
                socket.GetWebSocketData(function (webSocketUrl: string) {
                    socket.ConnectWebSocket(webSocketUrl);
                });
            }
        }

        /**
         * Does the initial work to get the application ready to send/receive messages, including
         * making sure that the user name and icon are set correctly
         */
        constructData() {
            VisitorId = this.generateVisitorId();

            if (Config.visitorIcon === null || Config.visitorIcon === undefined) {
                Config.visitorIcon = Strings.VISITOR_ICON;
            }

            if (Config.applicationName === null || Config.applicationName === undefined) {
                Config.applicationName = Strings.APP_NAME;
            } else {
                Strings.APP_NAME = Config.applicationName;
            }

            if (Config.supportGroupName === null || Config.supportGroupName === undefined) {
                Config.supportGroupName = Strings.INTERNAL_SUPPORT_GROUP_NAME;
            }
        }

        /**
         * If you're not using server side features, then we need to use
         * whatever data we have to make a unique (as close as possible) id
         * that we can use to ensure this user only gets messages intended
         * for them in the support interface
         */
        generateVisitorId(): string {
            var currentDate = new Date();
            var uniqueId = currentDate.getMilliseconds() + "" + Math.floor((Math.random() * 10) + 1);

            return uniqueId;
        }
    }
}