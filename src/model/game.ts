import { Player } from "./player";
import { Color } from "./color";
import { Status } from "./status";
import { Settings } from "./settings";
import { v4 as uuidv4 } from 'uuid';

export class Game {
	public id: string;
	public player1: Player;
	public player2: Player;
	public currentPlayer: number;
	public status: Status = Status.None
	public colors: Color[] = [];
	public message: string = '';

	constructor(player: string) {
		this.id = this.generateUniqueId()
		this.colors = Settings.COLORS
		const colorSet: Color[] = Settings.getRandomColors();
		this.player1 = new Player(1, player, colorSet)
		this.player2 = new Player(2, '', Settings.getRemainColors(colorSet))
		this.currentPlayer = 1
	}

	private generateUniqueId(): string {
		return 'G-' + uuidv4();
	}

	public getPlayer(playerId: number): Player {
		if (playerId === this.player1.id) {
			return this.player1;
		} else {
			return this.player2;
		}
	}

	public getOpponentPlayer(playerId: number): Player {
		if (playerId === this.player1.id) {
			return this.player2;
		} else {
			return this.player1;
		}
	}

	public setInProgressStatus(playerId: number, isHit: boolean) : void {	
		console.log('In Progress, playerId:' + playerId + ', IsHit: ' + isHit)
		if (isHit) {
			this.message = this.getPlayer(playerId).name + ' is playing';
			this.message += '<br>' + this.getPlayer(playerId).name + ' has hit.'
		} else {
			this.message = '<br>' + this.getPlayer(playerId).name + ' has missed it.';
		}
		this.status = Status.InProgress
	}

	public setStatus(status: Status) : void {
		this.status = status;
		this.message = '';
		switch(this.status) {
			case Status.Iniated:
				this.message = 'The game is iniated, waiting for the second player.';
				break;
			case Status.Ready:
				this.message = 'The second player ' + this.player2.name + " has been joined. It's ready to go.";
				this.message += "<br> It's <b>" + this.getPlayer(this.currentPlayer).name + "</b>'s choice to roll the dice.";
				break;
			case Status.Over:
				this.message = 'The game is over, ' + this.getPlayer(this.currentPlayer).name + ' has won.';
				this.getPlayer(this.currentPlayer).score += 1; 
				break;
			case Status.Restart:
				this.status = Status.Ready
				this.message = 'The game is restarted.';
				this.message += "<br> It's <b>" + this.getPlayer(this.currentPlayer).name + "</b>'s choice to roll the dice.";
				break;
			default:
				this.message;
		}
	}

	public restart(playerId: number): boolean {
		if (this.status === Status.Over) {
			console.log(playerId + ' has restarted the game');
			this.currentPlayer = playerId // Settings.getRandomPlayer(1,3) // to be set random
			const colorSet: Color[] = Settings.getRandomColors();
			this.player1.resetColorBags(colorSet);
			this.player2.resetColorBags(Settings.getRemainColors(colorSet));
			this.setStatus(Status.Restart)
			return true
		}
		return false
	}
}
