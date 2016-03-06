module SLjs {
    "use strict";

    export class Socket {
        /**
         * Obtains the websocket connection URL to be used for real time communication
         * @param callback Returns the URL to a callback
         */
        GetWebSocketData(callback: (webSocketUrl: string) => any) {
            var packet: Models.ISLWebsocketAuth = {
                mpim_aware: false,
                no_unreads: true,
                simple_latest: true,
                token: Config.token
            };

            Http.Action(packet, Endpoints.WebSocketStart, function (response: string) {
                var responsePacket: Models.ISLWebsocketAuthResponse = JSON.parse(response);

                for (var user of responsePacket.users) {
                    Users[user.id] = <Models.ISLSupportUser>{
                        name: user.real_name !== "" ? user.real_name : user.name,
                        presence: user.presence,
                        image: user.profile.image_72
                    };
                }

                callback(responsePacket.url);
            });
        }

        ConnectWebSocket(url: string) {
            var connection = new WebSocket(url);

            connection.onopen = function (event: Event) {
                // console.log("ws:connection opened");
                // console.log(event);
            };

            connection.onmessage = function (message: MessageEvent) {
                Events.OnMessageReceived(message.data);
            };

            connection.onerror = function (event: Event) {
                // console.log("ws:connection error");
                // console.log(event);
            };

            connection.onclose = function (event: CloseEvent) {
                // console.log("ws:connection closed");
                // console.log(event);
            };
        }
    }
}