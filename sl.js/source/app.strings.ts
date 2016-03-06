module SLjs.Strings {
    "use strict";

    // global application strings
    export var INTERNAL_APP_NAME = "SL.js";
    export var INTERNAL_SUPPORT_GROUP_NAME = "Support Team";
    export var APP_NAME = INTERNAL_APP_NAME;

    // info message strings sent in message packets to Slack
    export var FIRST_MESSAGE_HEADER = "First message for this visit to the channel";
    export var MESSAGE_REPLY_HINT = "Reply to me using !%VISITORID% [message]";
    export var ATTACHMENT_COLOR = "#D00000";

    // default value strings (unless overridden in config)
    export var VISITOR_ICON = ":speech_balloon:";

    // strings for the welcome message asking for their name
    export var WELCOME_MSG: string = "Welcome to " + APP_NAME + "!";
    export var NAME_REQUIRED: string = "During our conversation, what can we call you?";
    export var NAME_INPUT_PLACEHOLDER: string = "Enter your name in here";
    export var NAME_INPUT_VALIDATION_ERROR: string = "Sorry, can you try entering your name in again?";
    export var NAME_INPUT_BUTTON: string = "Continue";

    // strings for the chat discussion
    export var CHAT_INPUT_PLACEHOLDER: string = "Enter your message here. Use SHIFT+ENTER to create a new line.";
    export var CHAT_INITIAL_MSG: string = "Welcome to the support channel for " + APP_NAME +
                                           ". Please ask your question in this channel and someone will get back to you shortly.";
}