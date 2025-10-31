# Multi-stage Dockerfile for building the Vite React app and serving it with nginx
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the static site
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
