FROM node

# set working directory
RUN mkdir /main
WORKDIR /main

# copy pkg configs and caches
COPY package.json ./

# install packages
RUN npm install

# install prisma globally
RUN npm install -g prisma
RUN npm install -g graphql-cli

ADD . .

# prisma configuration
#RUN docker-compose up -d
#RUN prisma deploy

# run post deploy hook
#RUN graphql get-schema --project database
#RUN graphql prepare
CMD ["docker-compose", "up -d"]

CMD ["node", "src/index.js"]