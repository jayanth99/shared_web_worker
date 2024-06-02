**Single WebSocket for Multiple Tabs POC**

Create a single web socket connection via [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker) so that all tabs could communicate through the same connection.

***Findings:***
* Need a local server to serve the current directory. Some of them are `python server`, `http-server`, `xampp server` and `serve` npm package.
* I have used `serve` npm package by running `npm install -i serve`.
* Source code contains `index.html` which serves the content. This is backed up by `main.js` in which a `SharedWorker` is created and that can be used to synchronize the messages.
* Used [blob storage](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static) to create shared worker.
* Added `server.js` file which listens to a particular port that starts the local server.

***Demo Steps:***
* First start the server by running `node server.js`.
* Serve the current directory using `serve` command.
* Go to the specified URL given by the serve package and end point is `index.html`.
* Open one more browser tab with the same address and start sending messages.
* The user will be able to see the messages in both the pages, which is implemented by shared worker.

***Limitations of SharedWorker:***
* It doesn't work with normal `file:///` prototype. That's the reason I has to use "serve" npm package to serve the current directory.
* Shared Web Workers have less browser support compared to broadcast channels.
* Also we cannot send circular data via SharedWorker.
