import {
    listenAndServe, acceptWebSocket, acceptable,
    // WebSocket
} from './deps.js';
import { chat } from './chat.js';

const PORT = 5000

listenAndServe({ port: PORT }, async (req) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            req.respond({
                status: 200,
                headers: new Headers({
                    'Content-Type': 'text/html',
                }),
                body: await Deno.open('./index.html')
            })
        }
        if (req.url === '/ws') {
            if (acceptable(req)) {
                acceptWebSocket({
                    conn: req.conn,
                    bufReader: req.r,
                    bufWriter: req.w,
                    headers: req.headers
                })
                    .then(chat)
                    .catch(async (err) => {
                        console.error(`failed to accept websocket: ${err}`);
                        await req.respond({ status: 400 });
                    });
            }
        }
    }


})

console.log('Server running on port' + PORT);
