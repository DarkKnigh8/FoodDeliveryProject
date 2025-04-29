SETUP FOR DOCKER AND KUBERNETES (DESKTOP VERSION)

# Build all microservices from backend directory
cd C:\Users\USER\Desktop\year3s2\food_deliveryservice_project\backend

# Build images
docker build -t order-service ./order
docker build -t restaurant-service ./restaurant
docker build -t admin-service ./admin
docker build -t auth-service ./auth
docker build -t delivery-service ./delivery
docker build -t payment-service ./payment

#BUILD IMAGES USING THE DOCKER-COMPOSE.YML FILE

docker compose up --build


# Tag images (replace YOUR_DOCKERHUB_USER)
docker tag order-service YOUR_DOCKERHUB_USER/restaurant_repo:v4
docker tag restaurant-service YOUR_DOCKERHUB_USER/ds_assignment:v2
# Repeat for other services...

# Push to Docker Hub
docker push YOUR_DOCKERHUB_USER/food-delivery-order:v1
docker push YOUR_DOCKERHUB_USER/food-delivery-restaurant:v1
# Repeat for other services...

# Apply all deployments
kubectl apply -f .\k8s\order-deployment.yaml
kubectl apply -f .\k8s\restaurant-deployment.yaml
kubectl apply -f .\k8s\admin-deployment.yaml
kubectl apply -f .\k8s\auth-deployment.yaml
kubectl apply -f .\k8s\delivery-deployment.yaml
kubectl apply -f .\k8s\payment-deployment.yaml


# Verify
kubectl get pods
kubectl get svc

# Access services (after minikube start)
minikube service order-service --url
minikube service restaurant-service --url
# Repeat for other services...
