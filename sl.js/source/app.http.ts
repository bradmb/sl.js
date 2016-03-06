module SLjs.Http {
    "use strict";

    /**
     * Performs the HTTP action required for whatever method is calling it
     * @param packet The message packet that will be turned into a JSON object
     * @param action The API action to execute
     * @param callback Returns the JSON response as a string, ready for parsing into an object
     */
    export function Action(packet: any, action: string, callback?: (response: string) => any) {
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

        var endpoint = Endpoints.ApiHost + action + "?token=" + Config.token + "&channel=" + Config.channel + "&";
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
}