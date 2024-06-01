// function to convert Array Buffer to String 
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// importing ws module for creating Websockets
const WebSocket = require("ws");

// Start our WS server at 2021
const wss = new WebSocket.Server({port: 2021}, function() {console.log("Server created successfully and listening on 2021")});

wss.on("connection", ws => {
    console.log('New Client connected!!');

    ws.on("message", data => {
        console.log('Message: ', data, 'ab2str', ab2str(data));
        ws.send(ab2str(data));
        //ws.send(JSON.stringify({messageFromServer: 'Hello tab id: ${parsed.data.from}'}));
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
