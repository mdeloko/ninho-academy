echo "Resetando banco de dados..."
docker-compose down -v
rm -f backend/database.sqlite
docker volume prune -f
docker system prune -f
echo "Banco resetado! Iniciando containers..."
docker-compose up