#! /bin/bash

echo "Using project ID: $PROJECT_ID "
echo "Region: $REGION "

IMAGE_PATH="$REGION-docker.pkg.dev/$PROJECT_ID/mailerone-backend-repo/mailerone-backend:latest"


# Pull in latest docker image from the registry
echo "Pulling latest image..."
sudo docker pull $IMAGE_PATH
echo "Stop existing container if it exists"
sudo docker stop mailerone-backend || true
sudo docker rm mailerone-backend || true

sudo docker run -d -p 5003:5003 --name mailerone-backend --restart unless-stopped $IMAGE_PATH

echo "Cleaning up dangling images..."
sudo docker prune -f

echo "Deployment successfully done!"
