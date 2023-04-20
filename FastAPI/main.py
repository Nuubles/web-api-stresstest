from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from model import Kortti, Henkilo, Oikeudet
from typing import List
from database import get_db
from sqlalchemy.orm import Session
from time import time

templatecard = {
    'id': -1,
    'teksti': "This is a template card",
    'hallitsija': True
}

app = FastAPI()

@app.get('/users/{userId}/cards')
async def cards(userId: int, db: Session = Depends(get_db)):
    dbRes = db.query(Kortti.id, Kortti.teksti, Oikeudet.hallitsija).join(Oikeudet).join(Henkilo).filter(Henkilo.id == userId).all()
    dbRes.append(templatecard)
    dbRes.sort(key = lambda x: x['teksti'])
    return dbRes

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket('/clock')
async def clock(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if(data == 'requestTime'):
                await manager.broadcast(f"{int(time() * 1000)}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

