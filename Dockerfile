FROM node:17-slim
LABEL maintainer="staff@hackarmour.tech"

# Specify Working Directory
WORKDIR /usr/app
COPY ./ /usr/app

# Install the dependencies
RUN npm install

# Start the script
CMD ["npm", "start"]