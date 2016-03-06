module SLjs.Interface {
    var ApplicationInterface: HTMLDivElement;
    var ParentElement: HTMLElement;

    /**
     * Builds the parent interface that all objects will be rendered into
     */
    export function ConstructInterface(parentElement: HTMLElement) {
        // The wrapper that will dim the rest of the page
        var wrapper = document.createElement('div');
        wrapper.id = Parameters.INTERFACE_WRAPPER_DIV_ID;

        // The pre-existing div on the page we're going to use
        ParentElement = parentElement;
        ParentElement.appendChild(wrapper);

        // The box that holds the entire application
        ApplicationInterface = document.createElement('div');
        ApplicationInterface.id = Parameters.INTERFACE_DIV_ID;
        wrapper.appendChild(ApplicationInterface);

        // Wrapper for the button below
        var closeButtonBox = document.createElement('div');
        closeButtonBox.className = 'close-button';
        ApplicationInterface.appendChild(closeButtonBox);

        // Closes out of the application
        var closeButton = document.createElement('button');
        closeButton.innerText = 'x';
        closeButton.onclick = function () {
            ParentElement.innerHTML = '';
        }
        closeButtonBox.appendChild(closeButton);
    }

    /**
     * Builds the welcome screen, asking for the user's name
     * @param callback Returns to the parent method so we can put their name into a variable and build the conversation window
     */
    export function ConstructWelcomeWithName(callback: (name: string) => any) {
        ApplicationInterface.className = 'welcome';
        
        // The welcome message
        var helloHeading = document.createElement('h2');
        helloHeading.innerText = Strings.WELCOME_MSG.replace(Strings.APP_NAME_PARAM, Config.applicationName);
        ApplicationInterface.appendChild(helloHeading);

        // The message asking for their name
        var nameHeading = document.createElement('h3');
        nameHeading.innerText = Strings.NAME_REQUIRED;
        ApplicationInterface.appendChild(nameHeading);

        // The wrapper for the input box that will take their name
        var nameInputBox = document.createElement('div');
        nameInputBox.className = 'welcome-input';
        ApplicationInterface.appendChild(nameInputBox);

        // The actual input box that takes their name
        var nameInput = document.createElement('input');
        nameInput.placeholder = Strings.NAME_INPUT_PLACEHOLDER;
        nameInputBox.appendChild(nameInput);
        nameInput.focus();

        // The button that will submit the form and move on (or fail validation)
        var nameInputBtn = document.createElement('button');
        nameInputBtn.innerText = Strings.NAME_INPUT_BUTTON;
        nameInputBtn.type = 'button';
        nameInputBtn.onclick = function () {
            if (nameInput.value.trim() == '') {
                nameHeading.className = 'validation-failed';
                nameHeading.innerText = Strings.NAME_INPUT_VALIDATION_ERROR;

                nameInput.className = 'validation-failed';
                nameInput.focus();
                return;
            }

            callback(nameInput.value);
        };

        nameInputBox.appendChild(nameInputBtn);
    }

    export function ConstructConversationWindow() {
        ApplicationInterface.innerHTML = '';

        var helloHeading = document.createElement('h2');
        helloHeading.innerText = Strings.WELCOME_MSG.replace(Strings.APP_NAME_PARAM, Config.applicationName);
        ApplicationInterface.appendChild(helloHeading);

    }
}