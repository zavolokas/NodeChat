FROM node:8

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app
RUN npm install
ENV WEATHER_SERVICE_HOST=weather-service

# Bundle app source
COPY . /app
CMD "node" "bin/www"
EXPOSE 3000