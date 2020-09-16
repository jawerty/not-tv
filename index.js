const http = require('http');
const app = require('./app');
const ChatServer = require('./lib/chat-server');

const server = http.createServer(app);
const chatServer = new ChatServer(server);
chatServer.init();

const PORT = 3000;
server.listen(PORT, function() {
	console.log(`Server listening on 0.0.0.0:${PORT}`);
})