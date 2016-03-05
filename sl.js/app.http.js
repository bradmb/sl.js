var SLjs;
(function (SLjs) {
    /**
     * Performs the HTTP action required for whatever method is calling it
     * @param packet The message packet that will be turned into a JSON object
     * @param method Standard HTTP methods (GET/POST)
     */
    function SendHttpAction(packet, webhookUrl, method) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onload = function () {
            console.log(httpRequest.status);
            console.log(httpRequest.responseText);
        };
        httpRequest.open(method, webhookUrl, true);
        httpRequest.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        httpRequest.send(JSON.stringify(packet));
    }
    SLjs.SendHttpAction = SendHttpAction;
})(SLjs || (SLjs = {}));
//# sourceMappingURL=app.http.js.map