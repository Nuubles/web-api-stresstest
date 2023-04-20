#uvicorn main:app --host 127.0.0.1 --port 3000 --log-level critical
gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:3000 --log-level critical
