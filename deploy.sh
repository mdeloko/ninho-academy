#!/usr/bin/env bash
set -e

echo ">> Atualizando a codebase"
git pull

echo ">> Subindo os containers"
docker compose down
docker compose pull
docker compose up -d --build

echo ">> Deploy feito!"
echo "Acesse: https://ninho-academy.43464994.xyz"