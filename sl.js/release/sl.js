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
    var settings;
    (function (settings) {
    })(settings = SLjs.settings || (SLjs.settings = {}));
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
    var Interface;
    (function (Interface) {
        function ConstructInterface() {
            SLjs.settings.applicationInterface = document.createElement('div');
            SLjs.settings.applicationInterface.id = SLjs.Parameters.INTERFACE_DIV_ID;
            SLjs.settings.parentElement.appendChild(SLjs.settings.applicationInterface);
        }
        Interface.ConstructInterface = ConstructInterface;
        function ConstructWelcomeWithName(callback) {
            SLjs.settings.applicationInterface.className = 'welcome';
            var helloHeading = document.createElement('h2');
            helloHeading.innerText = SLjs.Strings.WELCOME_MSG.replace('%APPNAME%', SLjs.settings.config.applicationName);
            SLjs.settings.applicationInterface.appendChild(helloHeading);
            var nameHeading = document.createElement('h3');
            nameHeading.innerText = SLjs.Strings.NAME_REQUIRED;
            SLjs.settings.applicationInterface.appendChild(nameHeading);
            var nameInputBox = document.createElement('div');
            nameInputBox.className = 'welcome-input';
            SLjs.settings.applicationInterface.appendChild(nameInputBox);
            var nameInput = document.createElement('input');
            nameInput.placeholder = SLjs.Strings.NAME_INPUT_PLACEHOLDER;
            nameInputBox.appendChild(nameInput);
            var nameInputBtn = document.createElement('button');
            nameInputBtn.innerText = SLjs.Strings.NAME_INPUT_BUTTON;
            nameInputBtn.type = 'button';
            nameInputBtn.onclick = function () {
                callback(nameInput.value);
            };
            nameInputBox.appendChild(nameInputBtn);
        }
        Interface.ConstructWelcomeWithName = ConstructWelcomeWithName;
    })(Interface = SLjs.Interface || (SLjs.Interface = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Parameters;
    (function (Parameters) {
        Parameters.INTERFACE_DIV_ID = 'sljs-interface';
    })(Parameters = SLjs.Parameters || (SLjs.Parameters = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Strings;
    (function (Strings) {
        Strings.WELCOME_MSG = 'Welcome to %APPNAME%!';
        Strings.NAME_REQUIRED = 'Before we begin? What can we call you during our conversation?';
        Strings.NAME_INPUT_PLACEHOLDER = 'Enter your name in here';
        Strings.NAME_INPUT_BUTTON = 'Continue on';
    })(Strings = SLjs.Strings || (SLjs.Strings = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Application = (function () {
        function Application(config) {
            SLjs.settings.config = config;
            SLjs.settings.parentElement = document.getElementById(SLjs.settings.config.element);
            SLjs.Interface.ConstructInterface();
            this.constructData();
            if (SLjs.settings.config.visitorName === null || SLjs.settings.config.visitorName === undefined) {
                SLjs.Interface.ConstructWelcomeWithName(function (visitorName) {
                    console.log(visitorName);
                });
            }
            else {
                SLjs.settings.config.visitorName += ' (' + SLjs.settings.config.applicationName + ')';
            }
        }
        Application.prototype.constructData = function () {
            if (SLjs.settings.config.useServerSideFeatures === null || SLjs.settings.config.useServerSideFeatures === undefined) {
                SLjs.settings.config.useServerSideFeatures = false;
            }
            if (SLjs.settings.config.visitorIcon === null || SLjs.settings.config.visitorIcon === undefined) {
                SLjs.settings.config.visitorIcon = ':red_circle:';
            }
            if (SLjs.settings.config.applicationName === null || SLjs.settings.config.applicationName === undefined) {
                SLjs.settings.config.applicationName = 'SL.js';
            }
        };
        Application.prototype.sendInitialMessage = function (message) {
            var userDataPoints = [];
            if (!SLjs.settings.config.useServerSideFeatures) {
                userDataPoints.push({
                    title: 'First message for this visit to the channel',
                    text: 'Reply to me using !v1 [message]',
                    color: '#D00000'
                });
            }
            var packet = {
                attachments: userDataPoints,
                text: message,
                username: SLjs.settings.config.visitorName,
                icon_emoji: SLjs.settings.config.visitorIcon
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage, SLjs.settings.config);
        };
        Application.prototype.sendMessage = function (message) {
            if (!this.firstMessageSent) {
                this.firstMessageSent = true;
                this.sendInitialMessage(message);
                return;
            }
            var packet = {
                text: message,
                username: SLjs.settings.config.visitorName,
                icon_emoji: SLjs.settings.config.visitorIcon
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage, SLjs.settings.config);
        };
        return Application;
    })();
    SLjs.Application = Application;
})(SLjs || (SLjs = {}));
//# sourceMappingURL=sl.js.map