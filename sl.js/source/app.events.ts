module SLjs.Events {
    "use strict";

    export function OnMessageReceived(message: string) {
        var msgPreParse = JSON.parse(message);
        console.log(msgPreParse);

        switch (msgPreParse.type) {
            case "presence_change":
                var presenceData: Models.ISLSocketPresenceChange = msgPreParse;
                (Users[presenceData.user] as Models.ISLSupportUser).presence = presenceData.presence;
                break;
            case "message":
                var messageData: Models.ISLSocketMessage = msgPreParse;
                var user = (Users[messageData.user] as Models.ISLSupportUser);

                Interface.AddChatMessage({
                    icon_emoji: user.image,
                    text: messageData.text,
                    username: user.name
                });

                console.log(user.name + " said: " + messageData.text);
                break;
        }
    }
}

