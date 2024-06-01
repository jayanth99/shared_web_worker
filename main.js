// checking browser support for SharedWorker
if (window.SharedWorker) {
    console.log('document domain:', document.domain, document.documentURI, document.location);
    const str = `/**
    * Array to store all the connected ports in.
    */
   const connectedPorts = [];
   // Create socket instance.
   const socket = new WebSocket("ws://localhost:2021");
   // Send initial package on open.
   socket.addEventListener('open', () => {
     socket.send("Hello Server!!");
   });
   
   // Send data from socket to all open tabs.
   socket.addEventListener('message', ({ data }) => {
     //const package = JSON.parse(data);
     //connectedPorts.forEach(port => port.postMessage(package));
     connectedPorts.forEach(port => port.postMessage(data));
   });
   
   /**
   * When a new thread is connected to the shared worker,
   * start listening for messages from the new thread.
   */
   self.addEventListener('connect', ({ ports }) => {
     const port = ports[0];
   
     // Add this new port to the list of connected ports.
     connectedPorts.push(port);
   
     /**
     * Receive data from main thread and determine which
     * actions it should take based on the received data.
     */
     port.addEventListener('message', ({ data }) => {
       const { action, value } = data;
       
       // Send message to socket.
       if (action === 'send') {
         socket.send(value);
       // Remove port from connected ports list.
       } else if (action === 'unload') {
         const index = connectedPorts.indexOf(port);
         connectedPorts.splice(index, 1);
       }
     });
   
     // Start the port broadcasting.
     port.start();
    });`;
    const url = window.localStorage.getItem('url');

    let workletUrl='';

    if (url) workletUrl = url;
    else {console.log('url null');
        workletUrl = URL.createObjectURL(new Blob([str], {type: 'application/javascript'})); 
            window.localStorage.setItem('url', workletUrl);}
    webSocketWorker = new SharedWorker(workletUrl);
    // const webSocketWorker = new SharedWorker('worker.js');     // creating Shared Worker
    console.log('shared worker created: ', webSocketWorker);
    /**
     * Sends a message to the worker and passes that to the Web Socket.
     * @param {any} message 
     */
    /*const sendMessageToSocket = message => {
        webSocketWorker.port.postMessage({ 
            action: 'send', 
            value: message,
        });
    };*/

    // Event to listen for incoming data from the worker and update the DOM.
    webSocketWorker.port.addEventListener('message', ({ data }) => {
        var msg = document.getElementById('messages');
        msg.innerHTML+="<br />"+data;
    });

    // Initialize the port connection.
    webSocketWorker.port.start();
    
    // Event Handler on clicking send button
    document.getElementById('send').onclick = function() {
        var text = document.getElementById('text').value;
        
        webSocketWorker.port.postMessage({ 
            action: 'send', 
            value: text,
        });
    };

    // Get the input field
    var input = document.getElementById("text");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("send").click();
        }
    }); 

    // Remove the current worker port from the connected ports list.
    // This way your connectedPorts list stays true to the actual connected ports, 
    // as they array won't get automatically updated when a port is disconnected.
    window.addEventListener('beforeunload', () => {
        webSocketWorker.port.postMessage({ 
            action: 'unload', 
            value: null,
        });

        webSocketWorker.port.close();
    });
} else {
    console.log("Current browser doesn't support Shared Worker");
}