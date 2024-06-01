/**
 * Array to store all the connected ports in.
 */
const connectedPorts = [];
// Create socket instance.
const socket = new WebSocket("ws://localhost:2021");
// Send initial package on open.
socket.addEventListener('open', () => {
  socket.send("Hello Server!!");
});

socket.onclose = ev => {
   connectedPorts.forEach(port => port.postMessage(self.structuredClone(ev)));
  //  new Notification('', {data: obj, silent: true}).data;
}

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
});