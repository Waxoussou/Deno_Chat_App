import {
    isWebSocketCloseEvent,
    v4
} from './deps.js'

const socket = new Map();

function broadCast(message, senderId) {
    if (!message) return;
    for (const sock of socket.values()) {
        sock.send(JSON.stringify({ message, senderId }))
    }
}

export async function chat(ws) {
    const userId = v4.generate()

    // REGISTER USER CONNECTION
    socket.set(userId, ws)
    broadCast(`${userId} is connected`)

    // Wait for new message 
    for await (const event of ws) {
        const message = typeof event === 'string' ? event : '';
        broadCast(message, userId)

        // Unregister user connection
        if (!message && isWebSocketCloseEvent(event)) {
            socket.delete(userId)
            broadCast(`> User with the id ${userId} is disconnected`)
            break
        }
    }

}