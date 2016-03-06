module SLjs.Interface {
    var ApplicationInterface: HTMLDivElement;
    var ParentElement: HTMLElement;

    /**
     * Builds the parent interface that all objects will be rendered into
     */
    export function ConstructInterface(parentElement: HTMLElement) {
        ApplicationInterface = document.createElement('div');
        ApplicationInterface.id = Parameters.INTERFACE_DIV_ID;

        ParentElement = parentElement;
        ParentElement.appendChild(ApplicationInterface);
    }

    /**
     * Builds the welcome screen, asking for the user's name
     * @param callback Returns to the parent method so we can put their name into a variable and build the conversation window
     */
    export function ConstructWelcomeWithName(callback: (name: string) => any) {
        ApplicationInterface.className = 'welcome';

        var helloHeading = document.createElement('h2');
        helloHeading.innerText = Strings.WELCOME_MSG.replace(Strings.APP_NAME_PARAM, Config.applicationName);
        ApplicationInterface.appendChild(helloHeading);

        var nameHeading = document.createElement('h3');
        nameHeading.innerText = Strings.NAME_REQUIRED;
        ApplicationInterface.appendChild(nameHeading);

        var nameInputBox = document.createElement('div');
        nameInputBox.className = 'welcome-input';
        ApplicationInterface.appendChild(nameInputBox);

        var nameInput = document.createElement('input');
        nameInput.placeholder = Strings.NAME_INPUT_PLACEHOLDER;
        nameInputBox.appendChild(nameInput);
        nameInput.focus();

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