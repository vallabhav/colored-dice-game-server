import WebSocket from 'ws';
import {Game} from "./model/game";
import { Status } from "./model/status";
import { ClientAction } from "./model/clientAction";
import { Player } from "./model/player";
import { v4 as uuidv4 } from 'uuid';

var port: number = 3000;
var WebSocketServer = WebSocket.Server;
var server = new WebSocketServer({ port: port });
var games:Map<string, Game> =  new Map();

server.on('connection', (ws: any) => {
  ws.id = uuidv4();
	ws.on('message', (message: any) => {
		try {
			 console.log('message recieved from client:' + message);
			  const request: any = JSON.parse(message);
			  if (request) {
				 const action: string = request.action;
				 if (action === ClientAction.NewGame) {
					const game: Game = new Game(request.name)
					game.player1.clientId = ws.id;
					games.set(game.id, game)
					game.setStatus(Status.Iniated)
					broadcast(JSON.stringify(game), [ws.id]);
				 } else if(action === ClientAction.JoinGame) {
					let gameId: string = request.gameId;
					if (games.has(gameId)) {
						const game: Game | undefined = games.get(gameId);
						if (game) {
							const isComputer: boolean = request.isComputer;
							if (isComputer) {
								game.player2.name = 'computer'
								game.player2.clientId = 0
								game.player2.isComputer = true
							} else {
								game.player2.name = request.name
								game.player2.clientId = ws.id
							}
							game.setStatus(Status.Ready)
							broadcast(JSON.stringify(game), [game.player1.clientId, game.player2.clientId]);
						}
					}
				 } else if(action === ClientAction.RollDice) {
					let gameId: string = request.gameId;
					let playerId: number = request.playerId;
					let color: string = request.color;
					if (games.has(gameId)) {
						const game: Game | undefined = games.get(gameId)	
						if (game && game.currentPlayer === playerId) {
							let isHit: boolean = false;
							let opponent: Player = game.getOpponentPlayer(playerId);
							if (opponent.bag[color] && opponent.bag[color] > 0) { // hit
								opponent.bag[color]--;
								isHit = true
							} else { // miss
								game.currentPlayer = opponent.id;
							}
							if (opponent.hasBagEmpty()) {
								game.setStatus(Status.Over);
							} else {
								game.setInProgressStatus(playerId, isHit);
							}
							broadcast(JSON.stringify(game), [game.player1.clientId, game.player2.clientId]);
						}

					}
				 } else if (action === ClientAction.PlayAgain) {
					let gameId: string = request.gameId;
					let playerId: number = request.playerId;
					if (games.has(gameId)) {
						const game: Game | undefined = games.get(gameId)
						if (game) {
							const status: boolean = game.restart(playerId)
							if (status) {
								broadcast(JSON.stringify(game), [game.player1.clientId, game.player2.clientId]);
							}
						}
					}
				 }
			  }
		} catch (e) {
			console.error(e.message);
		}
	});
});

function broadcast(data: string, clientIds: number[]): void {
	server.clients.forEach((client: any) => {
		for (let i=0; i < clientIds.length; i++) {
			if (client.id == clientIds[i]) {
				console.log('sending message to client:' + data);
				client.send(data);
			}
		}
	});
};

console.log('Server is running on port', port);
