import createGame from './public/src/scripts/game.js';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static('public'));

const game = createGame();

game.subscribe((command) => {
  console.log(`[SERVER] -> Emitting: ${command.type}`);
  io.emit(command.type, command);
});

io.on('connection', (socket) => {
  const playerId = socket.id;
  //console.log(`[SERVER] -> Connected with id: '${playerId}' `);

  game.addPlayer({ id: playerId });

  io.emit('setup', game.state)

  socket.on('disconnect', () => {
    game.removePlayer({ id: playerId });
    //console.log(`[SERVER] -> Disconnected with id: '${playerId}' `);
  });

  socket.on('move-player', (command) => {
    command.id = playerId;
    command.type = 'move-player';

    game.movePlayer(command)
  });

  socket.on('start-game', () => {
    game.start();
    console.log("[SERVER] -> Game started");
  });

});

httpServer.listen(3000, () => {
  console.log('[SERVER] -> Server is running on port http://localhost:3000');
});