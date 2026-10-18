FROM nginx:alpine

# Copy nginx config
COPY infra/nginx.conf /etc/nginx/nginx.conf

# Copy web files
COPY apps/web /usr/share/nginx/html
COPY packages /usr/share/nginx/html/packages

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
