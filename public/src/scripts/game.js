export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10,
        }
    }

    const observers = []

    function start() {
        const frequency = 100

        setInterval(addFruit, frequency)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        observers.forEach(observerFunction => observerFunction(command))
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const player = {
            id: command.id,
            x: 'x' in command ? command.x : Math.floor(Math.random() * state.screen.width),
            y: 'y' in command ? command.y : Math.floor(Math.random() * state.screen.height),
            score: 0,
        }

        state.players[player.id] = {
            x: player.x,
            y: player.y,
            score: player.score,
        }

        notifyAll({
            type: 'add-player',
            id: player.id,
            x: player.x,
            y: player.y,

        })

        notifyAll({
            type: 'list-players',
            players: state.players
        })
        //console.log(`[GAME] -> New Player: ${player.id} - (${player.x}, ${player.y})`)
    }

    function removePlayer(command) {
        let id = command.id

        delete state.players[id]

        notifyAll({
            type: 'remove-player',
            id: id,
        })

        notifyAll({
            type: 'list-players',
            players: state.players
        })
        //console.log(`[GAME] -> Removendo player: ${command.id}`)
    }

    function addFruit(command) {
        const fruit = {
            id: command ? command.id : Math.floor(Math.random() * 10000000),
            x: command ? command.x : Math.floor(Math.random() * state.screen.width),
            y: command ? command.y : Math.floor(Math.random() * state.screen.width)
        }

        state.fruits[fruit.id] = {
            x: fruit.x,
            y: fruit.y,
        }

        notifyAll({
            type: 'add-fruit',
            id: fruit.id,
            x: fruit.x,
            y: fruit.y,
        })
    }

    function removeFruit(command) {
        delete state.fruits[command.id]

        notifyAll({
            type: 'remove-fruit',
            id: command.id,
        })

        notifyAll({
            type: 'list-players',
            players: state.players
        })
    }

    function movePlayer(command) {
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                player.y = Math.max(player.y - 1, 0)
            },
            ArrowDown(player) {
                player.y = Math.min(player.y + 1, state.screen.height - 1)
            },
            ArrowLeft(player) {
                player.x = Math.max(player.x - 1, 0)
            },
            ArrowRight(player) {
                player.x = Math.min(player.x + 1, state.screen.width - 1)
            }
        }
        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];
        if (player && moveFunction) {
            moveFunction(player)
            checkCollision(playerId)
        }

        function checkCollision(playerId) {
            const player = state.players[playerId]

            for (const fruitId in state.fruits) {
                const fruit = state.fruits[fruitId]
                if (player.x === fruit.x && player.y === fruit.y) {
                    removeFruit({ id: fruitId })
                    player.score++
                }
            }
        }

    }
    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        state,
        setState,
        subscribe,
        start,
    }
}