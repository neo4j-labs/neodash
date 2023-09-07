# Choose a base image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install --legacy-peer-deps

# Bundle app source
COPY scripts/mqttKafkaBridge.ts .

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the Docker daemon
EXPOSE 8080

# You might need to compile your typescript file to javascript before running it
# Use the tsc (TypeScript compiler) command to do this
RUN npm install -g typescript
RUN tsc mqttKafkaBridge.ts

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "mqttKafkaBridge.js" ]

