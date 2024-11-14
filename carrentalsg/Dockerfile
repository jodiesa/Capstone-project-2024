# Use the latest Node.js image
FROM node:latest AS backend

# Set up backend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

WORKDIR /app/api
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Use a different stage for frontend
FROM node:latest AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci  # This will install with package-lock.json for reproducibility
COPY . .

WORKDIR /app/client
RUN npm ci  # Install with package-lock.json in client directory as well
RUN npm run build

# Use Nginx to serve the frontend files
FROM nginx:alpine
COPY --from=frontend /app/client/build /usr/share/nginx/html

EXPOSE 80
