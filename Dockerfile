# Stage 1: Build the application
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies first (leverages Docker layer caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the production bundle
RUN npm run build:prod

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine AS runtime

# Copy custom Nginx config and built assets from the build stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/tax-report /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
