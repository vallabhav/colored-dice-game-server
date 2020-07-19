import { Color } from "./color"

export class Settings {
	public static readonly BAG_SIZE: number = 3
	public static readonly COLORS: Color[] = [Color.Blue, Color.Green, Color.Orange, Color.Purple, Color.Red, Color.Yellow]

	public static getRandomColors(): Color[] {
		const shuffled: Color[] = Settings.COLORS.sort(() => 0.5 - Math.random())
		let selected: Color[] = shuffled.slice(0, Settings.BAG_SIZE)
		return selected
	}

	public static getRemainColors(colors: Color[]): Color[] {
		let selected: Color[] = [];
		Settings.COLORS.forEach((color) => {
			if (!colors.includes(color)) {
				selected.push(color)
			}
		})
		return selected
	}

	public static getRandomPlayer(min: number, max: number) : number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

}

