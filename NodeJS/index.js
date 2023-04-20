const express = require('express');
const ws = require('ws');
const app = express();
const PORT = 3000;
const http = require('http');
const server = http.createServer(app);

const { Pool } = require('pg');

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "password",
  database: "stresstest",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const templateCard = {
    id: -1,
    teksti: "This is a template card",
    hallitsija: true
};

app.use("/users/:user/cards", async (req, res) => {
    let queryRes = await pool.query("SELECT kortti.id, kortti.teksti, oikeudet.hallitsija FROM kortti, oikeudet WHERE $1 = oikeudet.henkilo_id AND kortti.id = oikeudet.kortti_id", [req.params.user])
    queryRes = queryRes.rows;
    queryRes.push(templateCard);
    queryRes.sort((a, b) => a.teksti < b.teksti);
    res.json(queryRes);
});

app.use((err, req, res, next) => {
    res.status(500).json(err.message);
});

const wsServer = new ws.WebSocketServer({ server: server, path: "/clock" });

wsServer.on('connection', socket => {
    socket.on('error', err => {
        console.error(err);
    });

    socket.on('message', data => {
        if(data.toString() === "requestTime") {
            // broadcast time on requestTime event to all clients
            wsServer.clients.forEach(client => {
                if(client.readyState === ws.OPEN) {
                    client.send((new Date()).getMilliseconds());
                }
            });
        }
    });
});

// launch REST & WS servers
server.listen(3000);