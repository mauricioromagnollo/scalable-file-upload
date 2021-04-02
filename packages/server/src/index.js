const http = require('http');
const socketIo = require('socket.io');
const { logger } = require('./util');
const Routes = require('./routes');

const PORT = 3000;

const handler = function (request, response) {
  const defaultRoute = async (request, response) => response.end('Hello');

  const routes = new Routes(io);
  const chosen = routes[request.method.toLowerCase()] || defaultRoute;
  return chosen.apply(routes, [request, response]);
}

const server = http.createServer(handler);
const io = socketIo(server, {
  cors: {
    origin: "*",
    credentials: false
  }
});

io.on("connection", (socket) => logger.info('[!] Someone Connected! ' + socket.id));
// io.emit('file-uploaded', );

const startServer = () => {
  const { address, port } = server.address();
  console.log(`[*] Server running at http://${address}:${port}`);
}

server.listen(PORT, startServer);
