export default function createKetboardListener(document) {
    const state = {
        observers: [],
        playerId: null,
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId;
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {
        state.observers.forEach(observerFunction => observerFunction(command))
    }

    document.addEventListener('keydown', handleKeyDown)

    function handleKeyDown(event) {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }
        notifyAll(command)
    }

    return {
        subscribe,
        registerPlayerId
    }

}