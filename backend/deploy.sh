# Deploy to Azure Container Apps

# 1. Login to Azure
az login

# 2. Set subscription (replace with your sub ID)
az account set --subscription YOUR_SUBSCRIPTION_ID

# 3. Create a resource group (if not exists)
az group create --name myResourceGroup --location eastus

# 4. Create Azure Container Registry (ACR)
az acr create --resource-group myResourceGroup --name myacr --sku Basic

# 5. Login to ACR
az acr login --name myacr

# 6. Build and push Docker image to ACR
docker build -t myacr.azurecr.io/backend-app:v1 .
docker push myacr.azurecr.io/backend-app:v1

# 7. Create Azure Container Apps environment
az containerapp env create --name my-env --resource-group myResourceGroup --location eastus

# 8. Deploy the app
az containerapp create --name backend-app --resource-group myResourceGroup --environment my-env --image myacr.azurecr.io/backend-app:v1 --target-port 3000 --ingress external --query properties.configuration.ingress.fqdn

# Note: Add environment variables for DATABASE_URL and others via --env-vars