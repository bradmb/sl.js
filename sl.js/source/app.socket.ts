module SLjs {
    "use strict";
    export var InterfaceWebSocket: WebSocket = null;

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
            InterfaceWebSocket = new WebSocket(url);

            InterfaceWebSocket.onmessage = function (message: MessageEvent) {
                Events.OnMessageReceived(message.data);
            };
        }

        CloseWebSocket() {
            if (InterfaceWebSocket !== null) {
                InterfaceWebSocket.close();
                InterfaceWebSocket = null;
            }
        }
    }
}