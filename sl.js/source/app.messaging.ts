module SLjs.Messaging {
    "use strict";

    /**
     * Sends a standard message to the support channel
     * @param message The text that you want to be sent into the channel
     */
    export function SendMessage(message: string) {
        if (!this.firstMessageSent) {
            this.firstMessageSent = true;
            SendInitialMessage(message);

            return;
        }

        var packet: Models.ISLMessage = {
            text: message,
            username: Config.visitorName,
            icon_emoji: Config.visitorIcon
        };

        Http.Action(packet, Endpoints.PostMessage);
    }

    /**
     * Sends the initial message to the support channel, including additional user information
     * @param message The text that you want to be sent into the channel
     */
    function SendInitialMessage(message: string) {
        var userDataPoints: Models.ISLAttachmentItem[] = [];

        userDataPoints.push({
            title: "",
            text: Strings.MESSAGE_REPLY_HINT.replace("%VISITORID%", VisitorId),
            color: Strings.ATTACHMENT_COLOR
        });

        var packet: Models.ISLAttachment = {
            attachments: userDataPoints,
            text: message,
            username: Config.visitorName,
            icon_emoji: Config.visitorIcon
        };

        Http.Action(packet, Endpoints.PostMessage);
    }
}