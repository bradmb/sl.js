/// <reference path="app.interfaces.ts" />
/// <reference path="app.http.ts" />
/**
 * The base application that handles all primary SL.js functionality
 */
var SLjs;
(function (SLjs) {
    var Application = (function () {
        function Application(config) {
            this.config = config;
            this.element = document.getElementById(this.config.element);
            this.constructData();
            if (this.config.visitorName === null || this.config.visitorName === undefined) {
            }
            else {
                this.config.visitorName += ' (' + this.config.applicationName + ')';
            }
        }
        /**
         * Does the initial work to get the application ready to send/receive messages, including
         * making sure that the user name and icon are set correctly
         */
        Application.prototype.constructData = function () {
            if (this.config.useServerSideFeatures === null || this.config.useServerSideFeatures === undefined) {
                this.config.useServerSideFeatures = false;
            }
            if (this.config.visitorIcon === null || this.config.visitorIcon === undefined) {
                this.config.visitorIcon = ':red_circle:';
            }
            if (this.config.applicationName === null || this.config.applicationName === undefined) {
                this.config.applicationName = 'Visitor';
            }
        };
        /**
         * Sends the initial message to the support channel, including additional user information
         * @param message The text that you want to be sent into the channel
         */
        Application.prototype.sendInitialMessage = function (message) {
            var userDataPoints = [];
            if (!this.config.useServerSideFeatures) {
                userDataPoints.push({
                    short: false,
                    title: 'First message for this visit to the channel',
                    value: 'Reply to me using !v1 [message]'
                });
            }
            var packet = {
                color: '#D00000',
                fields: userDataPoints,
                text: '',
                fallback: message,
                pretext: message,
                username: this.config.visitorName,
                icon_emoji: this.config.visitorIcon
            };
            SLjs.SendHttpAction(packet, this.config.webhookUrl, 'POST');
        };
        /**
         * Sends a standard message to the support channel
         * @param message The text that you want to be sent into the channel
         */
        Application.prototype.sendMessage = function (message) {
            if (!this.firstMessageSent) {
                this.firstMessageSent = true;
                this.sendInitialMessage(message);
                return;
            }
            var packet = {
                text: message,
                username: this.config.visitorName,
                icon_emoji: this.config.visitorIcon
            };
            SLjs.SendHttpAction(packet, this.config.webhookUrl, 'POST');
        };
        return Application;
    })();
    SLjs.Application = Application;
})(SLjs || (SLjs = {}));
window.onload = function () {
    var slConfig = {
        webhookUrl: 'https://hooks.slack.com/services/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',
        visitorName: 'Brad the Builder',
        element: 'sl-app'
    };
    var sl = new SLjs.Application(slConfig);
    sl.sendMessage('This is my initial message');
    //sl.sendMessage('And this is an additional one');
};
//# sourceMappingURL=app.js.map