docker pull dbudnick/winnipeg-bus-web
docker pull dbudnick/winnipeg-bus-web-api
docker-compose down
docker-compose up -d
docker-compose logs -f
