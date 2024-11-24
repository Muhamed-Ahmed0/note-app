# Step 1: Set up the base image for the backend
FROM node:16 AS backend

# Step 2: Set the working directory for the backend
WORKDIR /app

# Step 3: Copy the backend package.json and install dependencies
COPY server/package.json server/package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the backend application
COPY server/ .

# Step 5: Build the React frontend
FROM node:16 AS frontend

# Set working directory for frontend
WORKDIR /client

# Copy the React frontend's package.json and install dependencies
COPY client/package.json client/package-lock.json ./
RUN npm install

# Build the React app for production
RUN npm run build

# Step 6: Set up a final image with both frontend and backend
FROM node:16

# Set working directory for backend
WORKDIR /app

# Copy the backend from the 'backend' stage
COPY --from=backend /app .

# Copy the frontend build from the 'frontend' stage
COPY --from=frontend /client/build /app/client/build

# Step 7: Install and start the backend server (Express)
RUN npm install --production

# Expose port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
