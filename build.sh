#!/usr/bin/env bash
set -e
python -m pip install --upgrade pip
pip install -r requirements.txt

# collectstatic AVANT démarrage
python manage.py collectstatic --noinput

# migrations (facultatif si POC + SQLite déjà migrée)
python manage.py migrate
# démarrage du serveur
python manage.py runserver