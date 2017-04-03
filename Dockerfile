FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

# Install prerequisites
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install -y nodejs

# Creating working directory.
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

# Copy source code into working directory.
COPY . /usr/src/app/

# Install dependencies.
RUN npm install
RUN npm run deploy

ONBUILD COPY . /usr/src/app/

EXPOSE 80
