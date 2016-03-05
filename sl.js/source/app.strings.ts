module SLjs.Strings {
    // Global application strings
    export var APP_NAME = 'SL.js';

    // Info message strings sent in message packets to Slack
    export var FIRST_MESSAGE_HEADER = 'First message for this visit to the channel';
    export var MESSAGE_REPLY_HINT = 'Reply to me using !v1 [message]';
    export var ATTACHMENT_COLOR = '#D00000';

    // Default value strings (unless overridden in config)
    export var VISITOR_ICON = ':red_circle:';

    // Strings for finding/replacing placeholder strings
    export var APP_NAME_PARAM: string = '%APPNAME%';

    // Strings for the welcome message asking for their name
    export var WELCOME_MSG: string = 'Welcome to ' + APP_NAME_PARAM + '!';
    export var NAME_REQUIRED: string = 'During our conversation, what can we call you?';
    export var NAME_INPUT_PLACEHOLDER: string = 'Enter your name in here';
    export var NAME_INPUT_BUTTON: string = 'Continue on';
}