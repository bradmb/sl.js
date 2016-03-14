module SLjs.Events {
    "use strict";

    /**
     * Handles any incoming message sent from the websocket connection and passes it on
     * @param message
     */
    export function OnMessageReceived(message: string) {
        var msgPreParse = JSON.parse(message);

        switch (msgPreParse.type) {
            case "presence_change":
                var presenceData: Models.ISLSocketPresenceChange = msgPreParse;
                (Users[presenceData.user] as Models.ISLSupportUser).presence = presenceData.presence;
                break;
            case "message":
                var messageData: Models.ISLSocketMessage = msgPreParse;

                if (messageData.username !== undefined && messageData.username === VisitorDisplayName) {
                    HtmlConstructor.AddChatMessage({
                        icon_emoji: messageData.icons.image_64,
                        text: messageData.text,
                        username: "You",
                        timespan: ""
                    });
                } else if (messageData.text === undefined
                           && messageData.subtype !== undefined
                           && messageData.subtype === "message_changed") {

                    var user = (Users[messageData.user] as Models.ISLSupportUser);

                    HtmlConstructor.UpdateChatMessage({
                        icon_emoji: "",
                        username: "",
                        text: messageData.message.text.replace("!" + VisitorId, ""),
                        timespan: messageData.message.ts
                    });
                } else if (messageData.text.substr(0, VisitorId.length + 1) === "!" + VisitorId) {
                    var user = (Users[messageData.user] as Models.ISLSupportUser);

                    HtmlConstructor.AddChatMessage({
                        icon_emoji: user.image,
                        text: messageData.text.replace("!" + VisitorId, ""),
                        username: user.name,
                        timespan: messageData.ts
                    });
                }
                break;
        }
    }
}

