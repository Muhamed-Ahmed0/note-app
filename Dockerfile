# Step 1: Set up the backend
FROM node:16 AS backend

# Set working directory for the backend
WORKDIR /app

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./ 

# Install backend dependencies
RUN npm install

# Copy the rest of the backend files
COPY backend/ .

# Step 2: Set up the frontend (Vite React)
FROM node:16 AS frontend

# Set working directory for the frontend
WORKDIR /frontend/note_app

# Copy frontend package files
COPY frontend/note_app/package.json frontend/note_app/package-lock.json ./ 

# Install frontend dependencies
RUN npm install

# Build the React app for production
RUN npm run build

# Step 3: Final stage to combine backend and frontend into one image
FROM node:16

# Set the working directory for the final app
WORKDIR /app

# Copy backend files from the 'backend' stage
COPY --from=backend /app . 

# Copy the frontend build files (including index.html) from the 'frontend' stage
COPY --from=frontend /frontend/note_app/dist /app

# Install production dependencies for the backend
RUN npm install --production

# Expose the port where the backend will run (change to 8000)
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]
