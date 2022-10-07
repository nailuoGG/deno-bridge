import { WebSocketClient, WebSocketServer, StandardWebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts";

const args = Deno.args;
const denoPort = args[1];
const emacsPort = args[2];

// Show message in Emacs minibuffer.
function messageToEmacs(message) {
    denoBridgeTypescriptSideClient.send(JSON.stringify({
        "type": "message",
        "content": message
    }))
}

// Get Emacs variable with `await getEmacsVar`.
function getEmacsVar(varName) {
    return new Promise((resolve, _) => {
        const client: WebSocketClient = new StandardWebSocketClient("ws://127.0.0.1:" + emacsPort);
        client.on("message", function (message: string) {
            resolve(message["data"]);
        });

        client.on("open", function() {
            client.send(JSON.stringify({
                "type": "var",
                "content": varName
            }));

        });
    })
}

const denoBridgeTypescriptSideServer = new WebSocketServer(denoPort.toString());
denoBridgeTypescriptSideServer.on("connection", function (client: WebSocketClient) {
    client.on("message", function (message: string) {
    });
});

const denoBridgeTypescriptSideClient: WebSocketClient = new StandardWebSocketClient("ws://127.0.0.1:" + emacsPort);
denoBridgeTypescriptSideClient.on("open", function() {
    console.log("Deno bridge connected!");
});
