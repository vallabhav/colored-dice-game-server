import { Color } from "./color";
import { Settings } from "./settings";

export class Player {
	public name: string;
	public id: number;
	public clientId: number = 0;
	public colors: Color[];
	public bag: any =  new Map();
	public isComputer: boolean = false
	public score: number = 0
	constructor(id: number, name: string, colors: Color[]) {
		this.id = id;
		this.name = name;
		this.colors = colors;
		this.resetColorBags(colors);
	}

	public resetColorBags(colors: Color[]): void {
		this.colors = colors
		for (let i:number = 0; i < this.colors.length; i++) {
			this.bag[this.colors[i]] = Settings.BAG_SIZE
		}
	}

	public hasBagEmpty(): boolean {
		let isEmpty: boolean = true;
		for (let i:number = 0; i < this.colors.length; i++) {
			if(this.bag[this.colors[i]] > 0) {
				return false;
			}
		}
		return isEmpty;
	}

	public isComputerPlayer(): boolean {
		return this.isComputer
	}
}
