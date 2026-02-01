FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend source code
COPY . .

# Expose the port Vite uses
EXPOSE 3001

# Run Vite dev server and force it to listen on all interfaces
CMD ["npm", "run", "dev", "--", "--host"]
