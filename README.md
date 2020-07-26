# Colored Dice Game Client
This is game server which is nodejs websocket server and the client application code found at https://github.com/vallabhav/colored-dice-game-client/
## Install in local environment

### Install all the dependent node modules
```
npm install
```
### compiles typescript
```
npm run tsc
```
### run the application
```
node build/app.js
```

Node js websocket server starts at http://localhost:3000/

## Run the app with docker container
### build docker image
```
docker build -t vallabhav/colored-dice-game-server .
```
### Check if the image now listed below by Docker:
```
docker images
```
### Run the image
```
docker run -p 3000:3000 -d vallabhav/colored-dice-game-server
```
Acess websocket server at http://localhost:3000/

