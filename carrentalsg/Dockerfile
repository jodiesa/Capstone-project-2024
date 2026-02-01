# Backend Stage
FROM node:latest AS backend

# Set up backend
WORKDIR /app
COPY package*.json ./  
RUN npm install
COPY . ./              

WORKDIR /app/api       
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Frontend Stage
FROM node:latest AS frontend

WORKDIR /app/client
COPY client/package*.json ./  
RUN rm -rf package-lock.json node_modules 
RUN npm install
COPY client/ ./          

EXPOSE 3001
CMD ["npm", "run", "dev"]



