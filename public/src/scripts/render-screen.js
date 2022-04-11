export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d');

    context.clearRect(0, 0, screen.width, screen.height);

    for (const id in game.state.players) {
        const player = game.state.players[id]

        if (id === currentPlayerId) {
            context.fillStyle = 'purple';
        } else {
            context.fillStyle = 'black';
        }

        context.fillRect(player.x, player.y, 1, 1)
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]

        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        context.fillStyle = 'green';
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}
