# STAGE 1: Build the React/Vite application
FROM node:20-alpine as build

WORKDIR /app

# Define the argument
ARG VITE_API_URL
# Set it as an environment variable so the build process sees it
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# STAGE 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]