var SLjs;
(function (SLjs) {
    var Endpoints;
    (function (Endpoints) {
        "use strict";
        Endpoints.ApiHost = "https://slack.com/api/";
        Endpoints.PostMessage = "chat.postMessage";
        Endpoints.WebSocketStart = "rtm.start";
    })(Endpoints = SLjs.Endpoints || (SLjs.Endpoints = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Http;
    (function (Http) {
        "use strict";
        function Action(packet, action, callback) {
            var httpRequest = new XMLHttpRequest();
            var postParameters = [];
            for (var param in packet) {
                if (packet.hasOwnProperty(param)) {
                    if (param === "attachments") {
                        packet[param] = JSON.stringify(packet[param]);
                    }
                    postParameters.push(encodeURIComponent(param) + "=" + encodeURIComponent(packet[param]));
                }
            }
            var endpoint = SLjs.Endpoints.ApiHost + action + "?token=" + SLjs.Config.token + "&channel=" + SLjs.Config.channel + "&";
            endpoint += postParameters.join("&");
            httpRequest.onreadystatechange = function () {
                if (callback != null && callback !== undefined && httpRequest.readyState === 4 && httpRequest.status === 200) {
                    callback(httpRequest.responseText);
                }
            };
            httpRequest.open("POST", endpoint, true);
            httpRequest.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
            httpRequest.send();
        }
        Http.Action = Action;
    })(Http = SLjs.Http || (SLjs.Http = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Interface;
    (function (Interface) {
        "use strict";
        var ApplicationInterface;
        var ApplicationInterfaceBody;
        var ParentElement;
        function ConstructInterface(parentElement) {
            var wrapper = document.createElement("div");
            wrapper.id = SLjs.Parameters.INTERFACE_WRAPPER_DIV_ID;
            ParentElement = parentElement;
            ParentElement.appendChild(wrapper);
            ApplicationInterface = document.createElement("div");
            ApplicationInterface.id = SLjs.Parameters.INTERFACE_DIV_ID;
            wrapper.appendChild(ApplicationInterface);
            var closeButtonBox = document.createElement("div");
            closeButtonBox.className = "sljs-close-button";
            ApplicationInterface.appendChild(closeButtonBox);
            var closeButton = document.createElement("button");
            closeButton.innerText = "x";
            closeButton.onclick = function () {
                ParentElement.innerHTML = "";
            };
            closeButtonBox.appendChild(closeButton);
            ApplicationInterfaceBody = document.createElement("div");
            ApplicationInterface.appendChild(ApplicationInterfaceBody);
        }
        Interface.ConstructInterface = ConstructInterface;
        function ConstructWelcomeWithName(callback) {
            ApplicationInterface.className = "sljs-welcome";
            var helloHeading = document.createElement("h2");
            helloHeading.innerText = SLjs.Strings.WELCOME_MSG.replace(SLjs.Strings.APP_NAME_PARAM, SLjs.Config.applicationName);
            ApplicationInterfaceBody.appendChild(helloHeading);
            var nameHeading = document.createElement("h3");
            nameHeading.innerText = SLjs.Strings.NAME_REQUIRED;
            ApplicationInterfaceBody.appendChild(nameHeading);
            var nameInputBox = document.createElement("div");
            nameInputBox.className = "sljs-welcome-input";
            ApplicationInterfaceBody.appendChild(nameInputBox);
            var nameInput = document.createElement("input");
            nameInput.placeholder = SLjs.Strings.NAME_INPUT_PLACEHOLDER;
            nameInputBox.appendChild(nameInput);
            nameInput.focus();
            var nameInputBtn = document.createElement("button");
            nameInputBtn.innerText = SLjs.Strings.NAME_INPUT_BUTTON;
            nameInputBtn.type = "button";
            nameInputBtn.onclick = function () {
                if (nameInput.value.trim() === "") {
                    nameHeading.className = "sljs-validation-failed";
                    nameHeading.innerText = SLjs.Strings.NAME_INPUT_VALIDATION_ERROR;
                    nameInput.className = "validation-failed";
                    nameInput.focus();
                    return;
                }
                callback(nameInput.value);
            };
            nameInputBox.appendChild(nameInputBtn);
        }
        Interface.ConstructWelcomeWithName = ConstructWelcomeWithName;
        function ConstructConversationWindow() {
            ApplicationInterface.className = "sljs-chat";
            ApplicationInterfaceBody.innerHTML = "";
            var helloHeading = document.createElement("h2");
            helloHeading.innerText = SLjs.Strings.WELCOME_MSG.replace(SLjs.Strings.APP_NAME_PARAM, SLjs.Config.applicationName);
            ApplicationInterfaceBody.appendChild(helloHeading);
        }
        Interface.ConstructConversationWindow = ConstructConversationWindow;
    })(Interface = SLjs.Interface || (SLjs.Interface = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Models;
    (function (Models) {
        "use strict";
    })(Models = SLjs.Models || (SLjs.Models = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Parameters;
    (function (Parameters) {
        "use strict";
        Parameters.INTERFACE_DIV_ID = "sljs-interface";
        Parameters.INTERFACE_WRAPPER_DIV_ID = "sljs-wrapper";
    })(Parameters = SLjs.Parameters || (SLjs.Parameters = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    "use strict";
    var Socket = (function () {
        function Socket() {
        }
        Socket.prototype.GetWebSocketData = function (callback) {
            var packet = {
                mpim_aware: false,
                no_unreads: true,
                simple_latest: true,
                token: SLjs.Config.token
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.WebSocketStart, function (response) {
                var responsePacket = JSON.parse(response);
                callback(responsePacket);
            });
        };
        Socket.prototype.ConnectWebSocket = function (url) {
            var connection = new WebSocket(url);
            connection.onopen = function (event) {
                console.log("ws:connection opened");
                console.log(event);
            };
            connection.onmessage = function (message) {
                console.log("ws:message received");
                console.log(message);
            };
            connection.onerror = function (event) {
                console.log("ws:connection error");
                console.log(event);
            };
            connection.onclose = function (event) {
                console.log("ws:connection closed");
                console.log(event);
            };
        };
        return Socket;
    })();
    SLjs.Socket = Socket;
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Strings;
    (function (Strings) {
        "use strict";
        Strings.APP_NAME = "SL.js";
        Strings.FIRST_MESSAGE_HEADER = "First message for this visit to the channel";
        Strings.MESSAGE_REPLY_HINT = "Reply to me using !v1 [message]";
        Strings.ATTACHMENT_COLOR = "#D00000";
        Strings.VISITOR_ICON = ":red_circle:";
        Strings.APP_NAME_PARAM = "%APPNAME%";
        Strings.WELCOME_MSG = "Welcome to " + Strings.APP_NAME_PARAM + "!";
        Strings.NAME_REQUIRED = "During our conversation, what can we call you?";
        Strings.NAME_INPUT_PLACEHOLDER = "Enter your name in here";
        Strings.NAME_INPUT_VALIDATION_ERROR = "Sorry, can you try entering your name in again?";
        Strings.NAME_INPUT_BUTTON = "Continue";
    })(Strings = SLjs.Strings || (SLjs.Strings = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    "use strict";
    SLjs.Users = {};
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
                SLjs.Config.visitorName += " (" + SLjs.Config.applicationName + ")";
                SLjs.Interface.ConstructConversationWindow();
                var socket = new SLjs.Socket();
                socket.GetWebSocketData(function (socketData) {
                    for (var user in socketData.users) {
                        if (socketData.users.hasOwnProperty(user)) {
                            var userData = socketData.users[user];
                            SLjs.Users[userData.id] = {
                                name: userData.real_name !== "" ? userData.real_name : userData.name,
                                presence: userData.presence,
                                image: userData.profile.image_24
                            };
                        }
                    }
                    socket.ConnectWebSocket(socketData.url);
                });
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
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage);
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
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage);
        };
        return Application;
    })();
    SLjs.Application = Application;
})(SLjs || (SLjs = {}));
//# sourceMappingURL=sl.js.map