FROM node:9.4.0

# Create non root node user and group & install app dependencies
RUN addgroup node; \
    mkdir /src; \
    adduser -h /src -D -s /bin/sh -G node node; \
    chgrp -R node /src; \
    chown -R node /src;

# Copy this first to prevent having to reinstall everything when any source changes.
COPY package.json package.json

# Install App
RUN npm --prefix /src install --production

# Bundle app source, skip files such as node_modules listed in .dockerignore.
COPY . .
COPY README.md /

# Create docs
RUN npm run gen-docs

# Default app port
EXPOSE 3600

# Run app with proper entry point and default command
CMD [ "npm", "start" ]
