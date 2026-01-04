# Stage 1: Build
FROM node:20-alpine AS builder

# Add the Build Argument
ARG VITE_API_URL
# Set it as an Environment Variable so npm run build can see it
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Fix React routing: redirect all requests to index.html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]