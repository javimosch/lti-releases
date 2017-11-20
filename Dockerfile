FROM node:8.5.0

# Install app dependencies
RUN mkdir /vendor
COPY package.json /vendor/package.json
RUN cd /vendor; npm install
ENV NODE_PATH /vendor/node_modules/

# Copy app source
VOLUME ['/www']

# Set work directory to /www
WORKDIR /www

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  8080

ENTRYPOINT ["npm","start"]
