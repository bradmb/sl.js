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
    var Events;
    (function (Events) {
        "use strict";
        function OnMessageReceived(message) {
            var msgPreParse = JSON.parse(message);
            switch (msgPreParse.type) {
                case "presence_change":
                    var presenceData = msgPreParse;
                    SLjs.Users[presenceData.user].presence = presenceData.presence;
                    break;
                case "message":
                    var messageData = msgPreParse;
                    if (messageData.username !== undefined && messageData.username === SLjs.VisitorDisplayName) {
                        SLjs.HtmlConstructor.AddChatMessage({
                            icon_emoji: messageData.icons.image_64,
                            text: messageData.text,
                            username: "You",
                            timespan: ""
                        });
                    }
                    else if (messageData.text === undefined
                        && messageData.subtype !== undefined
                        && messageData.subtype === "message_changed") {
                        var user = SLjs.Users[messageData.user];
                        SLjs.HtmlConstructor.UpdateChatMessage({
                            icon_emoji: "",
                            username: "",
                            text: messageData.message.text.replace("!" + SLjs.VisitorId, ""),
                            timespan: messageData.message.ts
                        });
                    }
                    else if (messageData.text.substr(0, SLjs.VisitorId.length + 1) === "!" + SLjs.VisitorId) {
                        var user = SLjs.Users[messageData.user];
                        SLjs.HtmlConstructor.AddChatMessage({
                            icon_emoji: user.image,
                            text: messageData.text.replace("!" + SLjs.VisitorId, ""),
                            username: user.name,
                            timespan: messageData.ts
                        });
                    }
                    break;
            }
        }
        Events.OnMessageReceived = OnMessageReceived;
    })(Events = SLjs.Events || (SLjs.Events = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Hours;
    (function (Hours) {
        "use strict";
        var Validation = (function () {
            function Validation() {
            }
            Validation.prototype.IsDuringWorkHours = function () {
                if (SLjs.Config.workDates === undefined || SLjs.Config.workDates === null) {
                    return true;
                }
                var isWorkDay = true;
                var currentDate = new Date();
                switch (currentDate.getDay()) {
                    case 0:
                        isWorkDay = SLjs.Config.workDates.sunday !== undefined
                            && SLjs.Config.workDates.sunday !== null
                            && SLjs.Config.workDates.sunday;
                        break;
                    case 1:
                        isWorkDay = SLjs.Config.workDates.monday !== undefined
                            && SLjs.Config.workDates.monday !== null
                            && SLjs.Config.workDates.monday;
                        break;
                    case 2:
                        isWorkDay = SLjs.Config.workDates.tuesday !== undefined
                            && SLjs.Config.workDates.tuesday !== null
                            && SLjs.Config.workDates.tuesday;
                        break;
                    case 3:
                        isWorkDay = SLjs.Config.workDates.wednesday !== undefined
                            && SLjs.Config.workDates.wednesday !== null
                            && SLjs.Config.workDates.wednesday;
                        break;
                    case 4:
                        isWorkDay = SLjs.Config.workDates.thursday !== undefined
                            && SLjs.Config.workDates.thursday !== null
                            && SLjs.Config.workDates.thursday;
                        break;
                    case 5:
                        isWorkDay = SLjs.Config.workDates.friday !== undefined
                            && SLjs.Config.workDates.friday !== null
                            && SLjs.Config.workDates.friday;
                        break;
                    case 6:
                        isWorkDay = SLjs.Config.workDates.saturday !== undefined
                            && SLjs.Config.workDates.saturday !== null
                            && SLjs.Config.workDates.saturday;
                        break;
                }
                if (!isWorkDay) {
                    return false;
                }
                var currentHourUtc = currentDate.getUTCHours();
                if (SLjs.Config.workDates.stopHourUtc < SLjs.Config.workDates.startHourUtc) {
                    if (SLjs.Config.workDates.startHourUtc < currentHourUtc
                        && SLjs.Config.workDates.stopHourUtc > currentHourUtc) {
                        return false;
                    }
                }
                else {
                    if (SLjs.Config.workDates.startHourUtc > currentHourUtc
                        || SLjs.Config.workDates.stopHourUtc < currentHourUtc) {
                        return false;
                    }
                }
                var currentMinutes = currentDate.getMinutes();
                if (SLjs.Config.workDates.startHourUtc === currentHourUtc
                    && SLjs.Config.workDates.startMinutes >= currentMinutes) {
                    return false;
                }
                if (SLjs.Config.workDates.stopHourUtc === currentHourUtc
                    && SLjs.Config.workDates.stopMinutes <= currentMinutes) {
                    return false;
                }
                return true;
            };
            return Validation;
        })();
        Hours.Validation = Validation;
    })(Hours = SLjs.Hours || (SLjs.Hours = {}));
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
    var HtmlConstructor;
    (function (HtmlConstructor) {
        "use strict";
        var ApplicationInterface;
        var ApplicationInterfaceBody;
        var ParentElement = null;
        var ChatMessageBox;
        var ChatMessageBoxItems = [];
        var ShowingWorkHourMessage;
        function ConstructInterface(parentElement) {
            if (ParentElement != null) {
                Dispose();
            }
            var wrapper = document.createElement("div");
            wrapper.id = SLjs.Parameters.INTERFACE_WRAPPER_DIV_ID;
            wrapper.className = "sljs-pos-" + SLjs.Config.position;
            if (SLjs.Config.position !== "float") {
                wrapper.className += " sljs-pos-side";
            }
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
                Dispose();
            };
            closeButtonBox.appendChild(closeButton);
            ApplicationInterfaceBody = document.createElement("div");
            ApplicationInterfaceBody.className = "sljs-app-wrapper";
            ApplicationInterface.appendChild(ApplicationInterfaceBody);
        }
        HtmlConstructor.ConstructInterface = ConstructInterface;
        function Dispose() {
            ChatMessageBoxItems = [];
            ChatMessageBox.remove();
            ApplicationInterfaceBody.remove();
            ApplicationInterface.remove();
            ParentElement.innerHTML = "";
            ParentElement.cloneNode(true);
            ParentElement = null;
            SLjs.VisitorDisplayName = null;
            SLjs.AppWebSocket.CloseWebSocket();
        }
        function ConstructWelcomeWithName(callback) {
            ApplicationInterface.className = "sljs-welcome";
            var helloHeading = document.createElement("h2");
            helloHeading.innerHTML = SLjs.Strings.WELCOME_MSG.replace("%APPNAME%", SLjs.Strings.APP_NAME);
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
            nameInputBox.onkeypress = function (key) {
                if (key.charCode === 13) {
                    if (nameInput.value.trim() === "") {
                        nameHeading.className = "sljs-validation-failed";
                        nameHeading.innerText = SLjs.Strings.NAME_INPUT_VALIDATION_ERROR;
                        nameInput.className = "validation-failed";
                        nameInput.focus();
                        return;
                    }
                    callback(nameInput.value);
                }
                return true;
            };
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
        HtmlConstructor.ConstructWelcomeWithName = ConstructWelcomeWithName;
        function ConstructConversationWindow() {
            ApplicationInterface.className = "sljs-chat";
            ApplicationInterfaceBody.innerHTML = "";
            ChatMessageBox = document.createElement("div");
            ChatMessageBox.className = "sljs-chat-messages";
            ApplicationInterfaceBody.appendChild(ChatMessageBox);
            var chatInputBox = document.createElement("textarea");
            chatInputBox.className = "sljs-chat-message-input";
            chatInputBox.placeholder = SLjs.Strings.CHAT_INPUT_PLACEHOLDER;
            chatInputBox.onkeypress = function (key) {
                if (key.charCode === 13 && key.shiftKey) {
                    return true;
                }
                else if (key.charCode === 13) {
                    SLjs.Messaging.SendMessage(chatInputBox.value);
                    chatInputBox.value = "";
                    return false;
                }
                return true;
            };
            ApplicationInterfaceBody.appendChild(chatInputBox);
            chatInputBox.focus();
            var workHours = new SLjs.Hours.Validation();
            if (workHours.IsDuringWorkHours()) {
                ShowingWorkHourMessage = false;
                AddChatMessage({
                    text: SLjs.Strings.CHAT_INITIAL_MSG.replace("%APPNAME%", SLjs.Strings.APP_NAME),
                    username: SLjs.Strings.APP_NAME,
                    icon_emoji: null,
                    isImportantMessage: true,
                    timespan: ""
                });
            }
            else {
                ShowingWorkHourMessage = true;
                AddChatMessage({
                    text: SLjs.Strings.CHAT_AFTER_HOURS_MSG.replace("%APPNAME%", SLjs.Strings.APP_NAME),
                    username: SLjs.Strings.APP_NAME,
                    icon_emoji: null,
                    isImportantMessage: true,
                    isErrorMessage: true,
                    timespan: ""
                });
            }
        }
        HtmlConstructor.ConstructConversationWindow = ConstructConversationWindow;
        function AddChatMessage(message) {
            var urlRegexMatch = SLjs.Parameters.REGEX_URL_MATCH_QUERY.exec(message.text);
            while (urlRegexMatch != null) {
                if (urlRegexMatch == null) {
                    return;
                }
                var link = document.createElement("a");
                link.href = urlRegexMatch[1];
                link.text = urlRegexMatch[1];
                link.target = "_blank";
                message.text = message.text.replace(urlRegexMatch[0], link.outerHTML);
                urlRegexMatch = SLjs.Parameters.REGEX_URL_MATCH_QUERY.exec(message.text);
            }
            if (message.username.length > 1) {
                message.username = message.username.charAt(0).toUpperCase() + message.username.slice(1);
                if (message.username.indexOf(" ") !== -1 && message.username !== SLjs.Strings.APP_NAME) {
                    message.username = message.username.split(" ")[0];
                }
            }
            message.text = message.text.replace("\n", document.createElement("br").outerHTML);
            if (message.username !== "You" && ShowingWorkHourMessage && !message.isImportantMessage) {
                ShowingWorkHourMessage = false;
                ChatMessageBoxItems.shift();
            }
            ChatMessageBoxItems.push(message);
            RenderChatMessages();
        }
        HtmlConstructor.AddChatMessage = AddChatMessage;
        function UpdateChatMessage(message) {
            var urlRegexMatch = SLjs.Parameters.REGEX_URL_MATCH_QUERY.exec(message.text);
            while (urlRegexMatch != null) {
                if (urlRegexMatch == null) {
                    return;
                }
                var link = document.createElement("a");
                link.href = urlRegexMatch[1];
                link.text = urlRegexMatch[1];
                link.target = "_blank";
                message.text = message.text.replace(urlRegexMatch[0], link.outerHTML);
                urlRegexMatch = SLjs.Parameters.REGEX_URL_MATCH_QUERY.exec(message.text);
            }
            ChatMessageBoxItems.forEach(function (item, index) {
                if (item.timespan === message.timespan) {
                    ChatMessageBoxItems[index].text = message.text;
                    RenderChatMessages();
                }
            });
        }
        HtmlConstructor.UpdateChatMessage = UpdateChatMessage;
        function RenderChatMessages() {
            ChatMessageBox.innerHTML = "";
            for (var _i = 0; _i < ChatMessageBoxItems.length; _i++) {
                var chatMsg = ChatMessageBoxItems[_i];
                var messageBox = document.createElement("div");
                messageBox.className = "sljs-chat-item";
                if (chatMsg.isImportantMessage !== undefined && chatMsg.isImportantMessage !== null) {
                    messageBox.className += " sljs-chat-item-important";
                }
                if (chatMsg.isErrorMessage !== undefined && chatMsg.isErrorMessage !== null) {
                    messageBox.className += " sljs-chat-item-error";
                }
                ChatMessageBox.appendChild(messageBox);
                if (chatMsg.icon_emoji != null) {
                    var messageIcon = document.createElement("img");
                    messageIcon.className = "sljs-chat-item-icon";
                    messageIcon.src = chatMsg.icon_emoji;
                    messageBox.appendChild(messageIcon);
                }
                if (chatMsg.username !== SLjs.Strings.APP_NAME) {
                    var messageSender = document.createElement("div");
                    messageSender.className = chatMsg.username !== "You" ?
                        "sljs-chat-item-support" :
                        "sljs-chat-item-sender";
                    messageSender.innerText = chatMsg.username !== "You" ?
                        chatMsg.username + " @ " + SLjs.Config.supportGroupName :
                        chatMsg.username;
                    messageBox.appendChild(messageSender);
                }
                var messageBody = document.createElement("div");
                messageBody.className = "sljs-chat-item-body";
                messageBody.innerHTML = chatMsg.text;
                messageBox.appendChild(messageBody);
            }
            ChatMessageBox.scrollTop = ChatMessageBox.scrollHeight;
        }
    })(HtmlConstructor = SLjs.HtmlConstructor || (SLjs.HtmlConstructor = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    var Messaging;
    (function (Messaging) {
        "use strict";
        function SendMessage(message) {
            if (!this.firstMessageSent) {
                this.firstMessageSent = true;
                SendInitialMessage(message);
                return;
            }
            var packet = {
                text: message,
                username: SLjs.VisitorDisplayName,
                icon_emoji: SLjs.Config.visitorIcon,
                timespan: ""
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage);
        }
        Messaging.SendMessage = SendMessage;
        function SendInitialMessage(message) {
            var userDataPoints = [];
            userDataPoints.push({
                title: "",
                text: SLjs.Strings.MESSAGE_REPLY_HINT.replace("%VISITORID%", SLjs.VisitorId),
                color: SLjs.Strings.ATTACHMENT_COLOR
            });
            var packet = {
                attachments: userDataPoints,
                text: message,
                username: SLjs.VisitorDisplayName,
                icon_emoji: SLjs.Config.visitorIcon,
                timespan: ""
            };
            SLjs.Http.Action(packet, SLjs.Endpoints.PostMessage);
        }
    })(Messaging = SLjs.Messaging || (SLjs.Messaging = {}));
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
        Parameters.REGEX_URL_MATCH_QUERY = /<([^><a]+)>/g;
        Parameters.INTERFACE_DIV_ID = "sljs-interface";
        Parameters.INTERFACE_WRAPPER_DIV_ID = "sljs-wrapper";
    })(Parameters = SLjs.Parameters || (SLjs.Parameters = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    "use strict";
    SLjs.InterfaceWebSocket = null;
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
                for (var _i = 0, _a = responsePacket.users; _i < _a.length; _i++) {
                    var user = _a[_i];
                    SLjs.Users[user.id] = {
                        name: user.real_name !== "" ? user.real_name : user.name,
                        presence: user.presence,
                        image: user.profile.image_72
                    };
                }
                callback(responsePacket.url);
            });
        };
        Socket.prototype.ConnectWebSocket = function (url) {
            SLjs.InterfaceWebSocket = new WebSocket(url);
            SLjs.InterfaceWebSocket.onmessage = function (message) {
                SLjs.Events.OnMessageReceived(message.data);
            };
        };
        Socket.prototype.CloseWebSocket = function () {
            if (SLjs.InterfaceWebSocket !== null) {
                SLjs.InterfaceWebSocket.close();
                SLjs.InterfaceWebSocket = null;
            }
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
        Strings.INTERNAL_APP_NAME = "SL.js";
        Strings.INTERNAL_SUPPORT_GROUP_NAME = "Support Team";
        Strings.APP_NAME = Strings.INTERNAL_APP_NAME;
        Strings.FIRST_MESSAGE_HEADER = "First message for this visit to the channel";
        Strings.MESSAGE_REPLY_HINT = "Reply to me using !%VISITORID% [message]";
        Strings.ATTACHMENT_COLOR = "#D00000";
        Strings.VISITOR_ICON = ":speech_balloon:";
        Strings.WELCOME_MSG = "Welcome to the support channel for<br/>%APPNAME%!";
        Strings.NAME_REQUIRED = "During our conversation, what can we call you?";
        Strings.NAME_INPUT_PLACEHOLDER = "Enter your name in here";
        Strings.NAME_INPUT_VALIDATION_ERROR = "Sorry, can you try entering your name in again?";
        Strings.NAME_INPUT_BUTTON = "Continue";
        Strings.CHAT_INPUT_PLACEHOLDER = "Enter your message here. Use SHIFT+ENTER to create a new line.";
        Strings.CHAT_AFTER_HOURS_MSG = "Welcome to the support channel for %APPNAME%. It is currently " +
            "outside of standard support hours, so please leave a message and we " +
            "will get back to you during standard business hours.";
        Strings.CHAT_INITIAL_MSG = "Welcome to the support channel for %APPNAME%. " +
            "Please ask your question in this channel and someone will get back to you shortly.";
    })(Strings = SLjs.Strings || (SLjs.Strings = {}));
})(SLjs || (SLjs = {}));
var SLjs;
(function (SLjs) {
    "use strict";
    SLjs.Users = {};
    SLjs.Config = {
        applicationName: SLjs.Strings.APP_NAME,
        channel: null,
        element: null,
        token: null,
        position: "float"
    };
    var Button = (function () {
        function Button(buttonId, config) {
            SLjs.AppHandler = new ApplicationHandler();
            SLjs.AppHandler.mapConfigParameters(config);
            SLjs.AppHandler.constructData();
            this.init(buttonId);
        }
        Button.prototype.init = function (buttonId) {
            var activatorButton = document.getElementById(buttonId);
            activatorButton.onclick = function () {
                SLjs.AppHandler.constructInterface();
            };
        };
        return Button;
    })();
    SLjs.Button = Button;
    var Interface = (function () {
        function Interface(config) {
            SLjs.AppHandler = new ApplicationHandler();
            SLjs.AppHandler.mapConfigParameters(config);
            SLjs.AppHandler.constructData();
            this.init();
        }
        Interface.prototype.init = function () {
            SLjs.AppHandler.constructInterface();
        };
        return Interface;
    })();
    SLjs.Interface = Interface;
    var ApplicationHandler = (function () {
        function ApplicationHandler() {
        }
        ApplicationHandler.prototype.constructInterface = function () {
            SLjs.HtmlConstructor.ConstructInterface(document.getElementById(SLjs.Config.element));
            if (SLjs.Config.visitorName === null || SLjs.Config.visitorName === undefined) {
                SLjs.HtmlConstructor.ConstructWelcomeWithName(function (visitorName) {
                    SLjs.Config.visitorName = visitorName;
                    SLjs.VisitorDisplayName = "[" + SLjs.VisitorId + "] " + visitorName + " (" + SLjs.Config.applicationName + ")";
                    SLjs.HtmlConstructor.ConstructConversationWindow();
                    SLjs.AppWebSocket = new SLjs.Socket();
                    SLjs.AppWebSocket.GetWebSocketData(function (webSocketUrl) {
                        SLjs.AppWebSocket.ConnectWebSocket(webSocketUrl);
                    });
                });
            }
            else {
                SLjs.VisitorDisplayName = "[" + SLjs.VisitorId + "] " + SLjs.Config.visitorName + " (" + SLjs.Config.applicationName + ")";
                SLjs.HtmlConstructor.ConstructConversationWindow();
                SLjs.AppWebSocket = new SLjs.Socket();
                SLjs.AppWebSocket.GetWebSocketData(function (webSocketUrl) {
                    SLjs.AppWebSocket.ConnectWebSocket(webSocketUrl);
                });
            }
        };
        ApplicationHandler.prototype.constructData = function () {
            SLjs.VisitorId = this.generateVisitorId();
            if (SLjs.Config.visitorIcon === null || SLjs.Config.visitorIcon === undefined) {
                SLjs.Config.visitorIcon = SLjs.Strings.VISITOR_ICON;
            }
            if (SLjs.Config.applicationName === null || SLjs.Config.applicationName === undefined) {
                SLjs.Config.applicationName = SLjs.Strings.APP_NAME;
            }
            else {
                SLjs.Strings.APP_NAME = SLjs.Config.applicationName;
            }
            if (SLjs.Config.supportGroupName === null || SLjs.Config.supportGroupName === undefined) {
                SLjs.Config.supportGroupName = SLjs.Strings.INTERNAL_SUPPORT_GROUP_NAME;
            }
        };
        ApplicationHandler.prototype.generateVisitorId = function () {
            var currentDate = new Date();
            var uniqueId = currentDate.getMilliseconds() + "" + Math.floor((Math.random() * 10) + 1);
            return uniqueId;
        };
        ApplicationHandler.prototype.mapConfigParameters = function (config) {
            for (var param in config) {
                if (config.hasOwnProperty(param) && config[param] !== undefined) {
                    SLjs.Config[param] = config[param];
                }
            }
        };
        return ApplicationHandler;
    })();
    SLjs.ApplicationHandler = ApplicationHandler;
})(SLjs || (SLjs = {}));
//# sourceMappingURL=sl.js.map