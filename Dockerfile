# Step 1: Set up the base image for the backend
FROM node:16 AS backend

# Set the working directory for the backend
WORKDIR /app

# Copy the backend package.json and package-lock.json into the image
COPY backend/package.json backend/package-lock.json ./

# Install the backend dependencies
RUN npm install

# Copy the rest of the backend application files
COPY backend/ .

# Step 2: Set up the frontend
FROM node:16 AS frontend

# Set the working directory for the frontend
WORKDIR /frontend

# Copy the frontend package.json and package-lock.json into the image (from the note_app folder)
COPY frontend/note_app/package.json frontend/note_app/package-lock.json ./

# Install the frontend dependencies
RUN npm install

# Build the React app for production
RUN npm run build

# Step 3: Final stage to merge the backend and frontend into one image
FROM node:16

# Set the working directory for the final app
WORKDIR /app

# Copy the backend files from the 'backend' stage
COPY --from=backend /app .

# Copy the frontend build files into the 'client/build' directory (from the frontend build)
COPY --from=frontend /frontend/build /app/client/build

# Install production dependencies for the backend
RUN npm install --production

# Expose the port where your backend will run
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
