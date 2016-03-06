﻿module SLjs.Events {
    "use strict";

    export function OnMessageReceived(message: string) {
        var msgPreParse = JSON.parse(message);

        switch (msgPreParse.type) {
            case "presence_change":
                var presenceData: Models.ISLSocketPresenceChange = msgPreParse;
                (Users[presenceData.user] as Models.ISLSupportUser).presence = presenceData.presence;
                break;
            case "message":
                var messageData: Models.ISLSocketMessage = msgPreParse;

                if (messageData.username !== undefined && messageData.username == Config.visitorName) {
                    Interface.AddChatMessage({
                        icon_emoji: messageData.icons.image_64,
                        text: messageData.text,
                        username: "You"
                    });
                } else {
                    var user = (Users[messageData.user] as Models.ISLSupportUser);

                    Interface.AddChatMessage({
                        icon_emoji: user.image,
                        text: messageData.text,
                        username: user.name
                    });
                }
                break;
        }
    }
}
