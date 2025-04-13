# Use an official Node runtime as a parent image
FROM node:18-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production (optional but recommended)
# RUN npm run build

# --- Production Stage (using a static server like Nginx) ---
# If you want a production build uncomment this section and the build stage above
# FROM nginx:stable-alpine
# Copy built assets from the build stage
# COPY --from=build-stage /app/build /usr/share/nginx/html
# Copy nginx config if needed (e.g., to handle routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# --- Development Stage (using React Dev Server) ---
# Use the build stage directly for development
FROM build-stage

# Expose port 3000 for the React dev server
EXPOSE 3000

# Command to run the app in development mode
CMD ["npm", "start"]