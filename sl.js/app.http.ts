module SLjs.Http {
    /**
     * Performs the HTTP action required for whatever method is calling it
     * @param packet The message packet that will be turned into a JSON object
     * @param method Standard HTTP methods (GET/POST)
     */
    export function Action(packet: Models.SLMessage, action: string, config: Models.SLconfig) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function () {
            console.log(httpRequest.status);
            console.log(httpRequest.responseText);
        }

        var postParameters = [];
        for (var param in packet) {
            if (param == 'attachments') {
                packet[param] = JSON.stringify(packet[param]);
            }

            postParameters.push(encodeURIComponent(param) + '=' + encodeURIComponent(packet[param]));
        }

        var endpoint = Endpoints.ApiHost + action + '?token=' + config.token + '&channel=' + config.channel + '&';
        endpoint += postParameters.join('&');

        httpRequest.open('POST', endpoint, true);
        httpRequest.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        httpRequest.send();
    }
}