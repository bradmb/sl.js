module SLjs.Interface {
    export function ConstructInterface() {
        settings.applicationInterface = document.createElement('div');
        settings.applicationInterface.id = Parameters.INTERFACE_DIV_ID;

        settings.parentElement.appendChild(settings.applicationInterface);
    }

    export function ConstructWelcomeWithName(callback: (name: string) => any) {
        settings.applicationInterface.className = 'welcome';

        var helloHeading = document.createElement('h2');
        helloHeading.innerText = Strings.WELCOME_MSG.replace('%APPNAME%', settings.config.applicationName);
        settings.applicationInterface.appendChild(helloHeading);

        var nameHeading = document.createElement('h3');
        nameHeading.innerText = Strings.NAME_REQUIRED;
        settings.applicationInterface.appendChild(nameHeading);

        var nameInputBox = document.createElement('div');
        nameInputBox.className = 'welcome-input';
        settings.applicationInterface.appendChild(nameInputBox);

        var nameInput = document.createElement('input');
        nameInput.placeholder = Strings.NAME_INPUT_PLACEHOLDER;
        nameInputBox.appendChild(nameInput);

        var nameInputBtn = document.createElement('button');
        nameInputBtn.innerText = Strings.NAME_INPUT_BUTTON;
        nameInputBtn.type = 'button';
        nameInputBtn.onclick = function () {
            callback(nameInput.value);
        };

        nameInputBox.appendChild(nameInputBtn);
    }
}