pip install waitress
waitress-serve --call 'main'
python3 main.py

gunicorn -k flask_sockets.worker stresstest:app
