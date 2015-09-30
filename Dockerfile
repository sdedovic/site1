FROM node:0.10

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

EXPOSE 8080
CMD ["node", "/src/index.js"]