FROM nginx

# Install dependencies
RUN apt-get update -qq && apt-get -y install apache2-utils

# Copy Nginx config template
COPY config/docker/dev/nginx.conf /etc/nginx/conf.d/default.conf

# Pipe logging to stdout
RUN ln -sf /dev/stdout /var/log/nginx/access.log

# And error logging to stderr
RUN ln -sf /dev/stderr /var/log/nginx/error.log

# Expose port 80
EXPOSE 80

# Copy the app files
COPY dist /var/www/html

# Use the "exec" form of CMD so Nginx shuts down gracefully on SIGTERM (i.e. `docker stop`)
CMD [ "nginx", "-g", "daemon off;" ]
