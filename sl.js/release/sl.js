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
    var Interface;
    (function (Interface) {
        var ApplicationInterface;
        var ParentElement;
        function ConstructInterface(parentElement) {
            ApplicationInterface = document.createElement('div');
            ApplicationInterface.id = SLjs.Parameters.INTERFACE_DIV_ID;
            ParentElement = parentElement;
            ParentElement.appendChild(ApplicationInterface);
        }
        Interface.ConstructInterface = ConstructInterface;
        function ConstructWelcomeWithName(callback) {
            ApplicationInterface.className = 'welcome';
            var helloHeading = document.createElement('h2');
            helloHeading.innerText = SLjs.Strings.WELCOME_MSG.replace(SLjs.Strings.APP_NAME_PARAM, SLjs.Config.applicationName);
            ApplicationInterface.appendChild(helloHeading);
            var nameHeading = document.createElement('h3');
            nameHeading.innerText = SLjs.Strings.NAME_REQUIRED;
            ApplicationInterface.appendChild(nameHeading);
            var nameInputBox = document.createElement('div');
            nameInputBox.className = 'welcome-input';
            ApplicationInterface.appendChild(nameInputBox);
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
        function ConstructConversationWindow() {
            ApplicationInterface.innerHTML = '';
            var helloHeading = document.createElement('h2');
            helloHeading.innerText = SLjs.Strings.WELCOME_MSG.replace(SLjs.Strings.APP_NAME_PARAM, SLjs.Config.applicationName);
            ApplicationInterface.appendChild(helloHeading);
        }
        Interface.ConstructConversationWindow = ConstructConversationWindow;
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
        Strings.APP_NAME = 'SL.js';
        Strings.FIRST_MESSAGE_HEADER = 'First message for this visit to the channel';
        Strings.MESSAGE_REPLY_HINT = 'Reply to me using !v1 [message]';
        Strings.ATTACHMENT_COLOR = '#D00000';
        Strings.VISITOR_ICON = ':red_circle:';
        Strings.APP_NAME_PARAM = '%APPNAME%';
        Strings.WELCOME_MSG = 'Welcome to ' + Strings.APP_NAME_PARAM + '!';
        Strings.NAME_REQUIRED = 'Before we begin? What can we call you during our conversation?';
        Strings.NAME_INPUT_PLACEHOLDER = 'Enter your name in here';
        Strings.NAME_INPUT_BUTTON = 'Continue on';
    })(Strings = SLjs.Strings || (SLjs.Strings = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Application = (function () {
        function Application(config) {
            SLjs.Config = config;
            this.constructData();
            SLjs.Interface.ConstructInterface(document.getElementById(SLjs.Config.element));
            if (SLjs.Config.visitorName === null || SLjs.Config.visitorName === undefined) {
                SLjs.Interface.ConstructWelcomeWithName(function (visitorName) {
                    SLjs.Config.visitorName = visitorName;
                    SLjs.Interface.ConstructConversationWindow();
                });
            }
            else {
                SLjs.Config.visitorName += ' (' + SLjs.Config.applicationName + ')';
                SLjs.Interface.ConstructConversationWindow();
            }
        }
        Application.prototype.constructData = function () {
            if (SLjs.Config.useServerSideFeatures === null || SLjs.Config.useServerSideFeatures === undefined) {
                SLjs.Config.useServerSideFeatures = false;
            }
            if (SLjs.Config.visitorIcon === null || SLjs.Config.visitorIcon === undefined) {
                SLjs.Config.visitorIcon = SLjs.Strings.VISITOR_ICON;
            }
            if (SLjs.Config.applicationName === null || SLjs.Config.applicationName === undefined) {
                SLjs.Config.applicationName = SLjs.Strings.APP_NAME;
            }
        };
        Application.prototype.sendInitialMessage = function (message) {
            var userDataPoints = [];
            if (!SLjs.Config.useServerSideFeatures) {
                userDataPoints.push({
                    title: SLjs.Strings.FIRST_MESSAGE_HEADER,
                    text: SLjs.Strings.MESSAGE_REPLY_HINT,
                    color: SLjs.Strings.ATTACHMENT_COLOR
                });
            }
            var packet = {
                attachments: userDataPoints,
                text: message,
                username: SLjs.Config.visitorName,
                icon_emoji: SLjs.Config.visitorIcon
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage, SLjs.Config);
        };
        Application.prototype.sendMessage = function (message) {
            if (!this.firstMessageSent) {
                this.firstMessageSent = true;
                this.sendInitialMessage(message);
                return;
            }
            var packet = {
                text: message,
                username: SLjs.Config.visitorName,
                icon_emoji: SLjs.Config.visitorIcon
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage, SLjs.Config);
        };
        return Application;
    })();
    SLjs.Application = Application;
})(SLjs || (SLjs = {}));
//# sourceMappingURL=sl.js.map