FROM node:12
# Create app directory
WORKDIR /app
#COPY package*.json ./
COPY . .
# RUN npm cache clean
#RUN rm -rf node_modules
RUN npm install
RUN chmod -R a+rwx ./node_modules 
RUN npm run tsc
EXPOSE 3000
CMD [ "node", "build/app.js" ]