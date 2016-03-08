module SLjs.Interface {
    "use strict";

    var ApplicationInterface: HTMLDivElement;
    var ApplicationInterfaceBody: HTMLDivElement;
    var ParentElement: HTMLElement;
    var ChatMessageBox: HTMLDivElement;
    var ChatMessageBoxItems: Models.ISLMessage[] = [];
    var ShowingWorkHourMessage: boolean;

    /**
     * Builds the parent interface that all objects will be rendered into
     * @param parentElement The pre-existing element we'll render all elements into
     */
    export function ConstructInterface(parentElement: HTMLElement) {
        // the wrapper that will dim the rest of the page
        var wrapper = document.createElement("div");
        wrapper.id = Parameters.INTERFACE_WRAPPER_DIV_ID;
        wrapper.className = "sljs-pos-" + Config.position;

        if (Config.position !== "float") {
            wrapper.className += " sljs-pos-side";
        }

        // the pre-existing div on the page we"re going to use
        ParentElement = parentElement;
        ParentElement.appendChild(wrapper);

        // the box that holds the entire application
        ApplicationInterface = document.createElement("div");
        ApplicationInterface.id = Parameters.INTERFACE_DIV_ID;
        wrapper.appendChild(ApplicationInterface);

        // wrapper for the button below
        var closeButtonBox = document.createElement("div");
        closeButtonBox.className = "sljs-close-button";
        ApplicationInterface.appendChild(closeButtonBox);

        // closes out of the application
        var closeButton = document.createElement("button");
        closeButton.innerText = "x";
        closeButton.onclick = function () {
            ParentElement.innerHTML = "";
        };
        closeButtonBox.appendChild(closeButton);

        ApplicationInterfaceBody = document.createElement("div");
        ApplicationInterfaceBody.className = "sljs-app-wrapper";
        ApplicationInterface.appendChild(ApplicationInterfaceBody);
    }

    /**
     * Builds the welcome screen, asking for the user"s name
     * @param callback Returns to the parent method so we can put their name into a variable and build the conversation window
     */
    export function ConstructWelcomeWithName(callback: (name: string) => any) {
        ApplicationInterface.className = "sljs-welcome";

        // the welcome message
        var helloHeading = document.createElement("h2");
        helloHeading.innerHTML = Strings.WELCOME_MSG.replace("%APPNAME%", Strings.APP_NAME);
        ApplicationInterfaceBody.appendChild(helloHeading);

        // the message asking for their name
        var nameHeading = document.createElement("h3");
        nameHeading.innerText = Strings.NAME_REQUIRED;
        ApplicationInterfaceBody.appendChild(nameHeading);

        // the wrapper for the input box that will take their name
        var nameInputBox = document.createElement("div");
        nameInputBox.className = "sljs-welcome-input";
        ApplicationInterfaceBody.appendChild(nameInputBox);

        // the actual input box that takes their name
        var nameInput = document.createElement("input");
        nameInput.placeholder = Strings.NAME_INPUT_PLACEHOLDER;
        nameInputBox.appendChild(nameInput);

        nameInputBox.onkeypress = function (key: KeyboardEvent) {
            if (key.charCode === 13) {
                if (nameInput.value.trim() === "") {
                    nameHeading.className = "sljs-validation-failed";
                    nameHeading.innerText = Strings.NAME_INPUT_VALIDATION_ERROR;

                    nameInput.className = "validation-failed";
                    nameInput.focus();
                    return;
                }

                callback(nameInput.value);
            }

            return true;
        };


        nameInput.focus();

        // the button that will submit the form and move on (or fail validation)
        var nameInputBtn = document.createElement("button");
        nameInputBtn.innerText = Strings.NAME_INPUT_BUTTON;
        nameInputBtn.type = "button";
        nameInputBtn.onclick = function () {
            if (nameInput.value.trim() === "") {
                nameHeading.className = "sljs-validation-failed";
                nameHeading.innerText = Strings.NAME_INPUT_VALIDATION_ERROR;

                nameInput.className = "validation-failed";
                nameInput.focus();
                return;
            }

            callback(nameInput.value);
        };

        nameInputBox.appendChild(nameInputBtn);
    }

    /**
     * Builds the conversation window that will be used to display messages
     */
    export function ConstructConversationWindow() {
        ApplicationInterface.className = "sljs-chat";
        ApplicationInterfaceBody.innerHTML = "";

        ChatMessageBox = document.createElement("div");
        ChatMessageBox.className = "sljs-chat-messages";
        ApplicationInterfaceBody.appendChild(ChatMessageBox);

        var chatInputBox = document.createElement("textarea");
        chatInputBox.className = "sljs-chat-message-input";
        chatInputBox.placeholder = Strings.CHAT_INPUT_PLACEHOLDER;

        chatInputBox.onkeypress = function (key: KeyboardEvent) {
            if (key.charCode === 13 && key.shiftKey) {
                return true;
            } else if (key.charCode === 13) {
                Messaging.SendMessage(chatInputBox.value);
                chatInputBox.value = "";

                return false;
            }

            return true;
        };

        ApplicationInterfaceBody.appendChild(chatInputBox);
        chatInputBox.focus();

        var workHours = new Hours.Validation();
        if (workHours.IsDuringWorkHours()) {
            ShowingWorkHourMessage = false;
            AddChatMessage({
                text: Strings.CHAT_INITIAL_MSG.replace("%APPNAME%", Strings.APP_NAME),
                username: Strings.APP_NAME,
                icon_emoji: null,
                isImportantMessage: true
            });
        } else {
            ShowingWorkHourMessage = true;
            AddChatMessage({
                text: Strings.CHAT_AFTER_HOURS_MSG.replace("%APPNAME%", Strings.APP_NAME),
                username: Strings.APP_NAME,
                icon_emoji: null,
                isImportantMessage: true,
                isErrorMessage: true
            });
        }
    }

    /**
     * Adds a new chat message into the conversation window
     * @param message
     */
    export function AddChatMessage(message: Models.ISLMessage) {
        var urlRegexMatch = Parameters.REGEX_URL_MATCH_QUERY.exec(message.text);
        while (urlRegexMatch != null) {
            if (urlRegexMatch == null) {
                return;
            }

            var link = document.createElement("a");
            link.href = urlRegexMatch[1];
            link.text = urlRegexMatch[1];
            link.target = "_blank";

            message.text = message.text.replace(urlRegexMatch[0], link.outerHTML);
            urlRegexMatch = Parameters.REGEX_URL_MATCH_QUERY.exec(message.text);
        }

        if (message.username.length > 1) {
            message.username = message.username.charAt(0).toUpperCase() + message.username.slice(1);

            if (message.username.indexOf(" ") !== -1 && message.username !== Strings.APP_NAME) {
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

    /**
     * Renders the messages into the conversation window. Function is called any time a new message is added.
     */
    function RenderChatMessages() {
        ChatMessageBox.innerHTML = "";

        for (var chatMsg of ChatMessageBoxItems) {
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

            if (chatMsg.username !== Strings.APP_NAME) {
                var messageSender = document.createElement("div");
                messageSender.className = chatMsg.username !== "You" ?
                                          "sljs-chat-item-support" :
                                          "sljs-chat-item-sender";

                messageSender.innerText = chatMsg.username !== "You" ?
                                          chatMsg.username + " @ " + Config.supportGroupName :
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
}