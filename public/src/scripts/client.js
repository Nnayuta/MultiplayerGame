import createGame from './game.js'
import createKetboardListener from './keyboard-listener.js'
import renderScreen from './render-screen.js'

const game = createGame()
const keyboardListener = createKetboardListener(document)

const socket = io();

socket.on('connect', () => {
    const divGame = document.getElementById('game')
    const screen = document.createElement('canvas')
    screen.id = 'screen'
    screen.width = game.state.screen.width
    screen.height = game.state.screen.height
    divGame.appendChild(screen)
    renderScreen(screen, game, requestAnimationFrame, socket.id)
})

socket.on('setup', (state) => {
    const playerId = socket.id
    game.setState(state)

    keyboardListener.registerPlayerId(playerId)
    keyboardListener.subscribe(game.movePlayer)
    keyboardListener.subscribe((command) => {
        socket.emit('move-player', command)
    })
});

const startGame = document.getElementById('start-game')
startGame.addEventListener('click', () => {
    socket.emit('start-game')
    startGame.innerHTML = 'Game started';
})

socket.on('add-player', (command) => {
    game.addPlayer(command)
});

socket.on('remove-player', (command) => {
    game.removePlayer(command)
});

socket.on('move-player', (command) => {
    const playerId = socket.id
    if (playerId !== command.playerId) {
        game.movePlayer(command)
    }
});

socket.on('add-fruit', (command) => {
    game.addFruit(command)
});

socket.on('remove-fruit', (command) => {
    game.removeFruit(command)
});

socket.on('list-players', (state) => {
    document.getElementById('listplayers').innerHTML = ''

    console.log(state)

    for (const playerId in state.players) {
        const player = state.players[playerId];

        document.getElementById('listplayers').innerHTML +=
            `
                <tr id='You'>
                    <td>${playerId}</td>
                    <td>${player.score}</td>
                </tr>
            `
    }
});
