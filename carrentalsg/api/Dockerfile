FROM node:20-alpine

WORKDIR /app

# Copy package.json first and install dependencies
COPY ../package*.json ../
RUN npm install

# Copy all backend source code
COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]
