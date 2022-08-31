FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY ./public/ ./
ENTRYPOINT ["nginx", "-g", "daemon off;"]
