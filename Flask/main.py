from flask import Flask, Response
from model import Kortti, Henkilo, Oikeudet
from database import db_session
import json

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

templatecard = {
    'id': -1,
    'teksti': "This is a template card",
    'hallitsija': True
}

app = Flask(__name__)

@app.route('/users/<userId>/cards', methods=['GET'])
def cards(userId):
    dbRes = db_session.query(Kortti.id, Kortti.teksti, Oikeudet.hallitsija).join(Oikeudet).join(Henkilo).filter(Henkilo.id == userId).all()
    dbRes.append(templatecard)
    dbRes.sort(key = lambda x: x['teksti'])
    dbRes = list(map(lambda x: dict(x), dbRes))
    return Response(json.dumps(dbRes), mimetype='application/json')

@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

if __name__ == '__main__':
    app.run(port=3000)
