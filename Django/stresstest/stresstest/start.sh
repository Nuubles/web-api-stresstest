#!/bin/bash
exec ./manage.py runserver 3000
daphne stresstest.asgi:application -p 3000 -b 0.0.0.0
