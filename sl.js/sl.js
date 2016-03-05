var SLjs;
(function (SLjs) {
    var Endpoints;
    (function (Endpoints) {
        Endpoints.ApiHost = 'https://slack.com/api/';
        Endpoints.PostMessage = 'chat.postMessage';
    })(Endpoints = SLjs.Endpoints || (SLjs.Endpoints = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Http;
    (function (Http) {
        function Action(packet, action, config) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onload = function () {
                console.log(httpRequest.status);
                console.log(httpRequest.responseText);
            };
            var postParameters = [];
            for (var param in packet) {
                if (param == 'attachments') {
                    packet[param] = JSON.stringify(packet[param]);
                }
                postParameters.push(encodeURIComponent(param) + '=' + encodeURIComponent(packet[param]));
            }
            var endpoint = SLjs.Endpoints.ApiHost + action + '?token=' + config.token + '&channel=' + config.channel + '&';
            endpoint += postParameters.join('&');
            httpRequest.open('POST', endpoint, true);
            httpRequest.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
            httpRequest.send();
        }
        Http.Action = Action;
    })(Http = SLjs.Http || (SLjs.Http = {}));
})(SLjs || (SLjs = {}));
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
        Application.prototype.sendInitialMessage = function (message) {
            var userDataPoints = [];
            if (!this.config.useServerSideFeatures) {
                userDataPoints.push({
                    title: 'First message for this visit to the channel',
                    text: 'Reply to me using !v1 [message]',
                    color: '#D00000'
                });
            }
            var packet = {
                attachments: userDataPoints,
                text: message,
                username: this.config.visitorName,
                icon_emoji: this.config.visitorIcon
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage, this.config);
        };
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
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage, this.config);
        };
        return Application;
    })();
    SLjs.Application = Application;
})(SLjs || (SLjs = {}));
//# sourceMappingURL=sl.js.map