FROM node
WORKDIR /usr/src/front-end
COPY ./front-end .
RUN npm install
RUN npm install -g @angular/cli@latest
CMD ["npm", "run", "start:prod"]