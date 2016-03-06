﻿module SLjs.Interface {
    "use strict";

    var ApplicationInterface: HTMLDivElement;
    var ApplicationInterfaceBody: HTMLDivElement;
    var ParentElement: HTMLElement;
    var ChatMessageBox: HTMLDivElement;
    var ChatMessageBoxItems: Models.ISLMessage[] = [];

    /**
     * Builds the parent interface that all objects will be rendered into
     */
    export function ConstructInterface(parentElement: HTMLElement) {
        // the wrapper that will dim the rest of the page
        var wrapper = document.createElement("div");
        wrapper.id = Parameters.INTERFACE_WRAPPER_DIV_ID;

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
        helloHeading.innerText = Strings.WELCOME_MSG;
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

    export function ConstructConversationWindow() {
        ApplicationInterface.className = "sljs-chat";
        ApplicationInterfaceBody.innerHTML = "";

        ChatMessageBox = document.createElement("div");
        ChatMessageBox.className = "sljs-chat-messages";

        ApplicationInterfaceBody.appendChild(ChatMessageBox);
    }

    export function AddChatMessage(message: Models.ISLMessage) {
        ChatMessageBoxItems.push(message);
        if (ChatMessageBoxItems.length > 10) {
            ChatMessageBoxItems.shift();
        }

        RenderChatMessages();
    }

    function RenderChatMessages() {
        ChatMessageBox.innerHTML = "";

        for (var chatMsg of ChatMessageBoxItems) {
            var messageItem = document.createElement("div");
            messageItem.innerHTML = chatMsg.text;

            ChatMessageBox.appendChild(messageItem);
        }
    }
}