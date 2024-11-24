# Step 1: Set up the base image for the backend
FROM node:16 AS backend

# Set the working directory for the backend
WORKDIR /app

# Copy the backend package.json and install dependencies
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Copy the rest of the backend application
COPY backend/ .

# Step 2: Set up the frontend
FROM node:16 AS frontend

# Set the working directory for the frontend
WORKDIR /frontend

# Copy the frontend package.json and install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Build the React app for production
RUN npm run build

# Step 3: Final stage to merge the backend and frontend into one image
FROM node:16

# Set the working directory for the app
WORKDIR /app

# Copy the backend files from the 'backend' stage
COPY --from=backend /app .

# Copy the frontend build files from the 'frontend' stage
COPY --from=frontend /frontend/build /app/client/build

# Install production dependencies for the backend
RUN npm install --production

# Expose the port where your backend will run
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
