import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

// TODO: blande farga om man bruka to farga i en event?
// TODO: custom scale istedenfor automap
// CouldDO: laga visuell scala under, me min max avg text
// CouldDO: konne legge til so monge farga man vil i colors array 

interface HeatmapCalendarSettings {
	year: number;
	defaultEntryIntensity: number;
	colors: {
		default: Array<string>;
	};
	entries: Array<Entry>;
}
const DEFAULT_SETTINGS: HeatmapCalendarSettings = {
	year: new Date().getFullYear(),
	defaultEntryIntensity: 4,
	colors: {
		default: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"]
	},
	entries: [{ date: "1900-01-01" }]
}
/*
colors: {
		default: ["#c6e48b","#7bc96f","#49af5d","#2e8840","#196127"],//green
		blue: ["#8cb9ff","#69a3ff","#428bff","#1872ff","#0058e2"],
		red: ["#ff9e82","#ff7b55","#ff4d1a","#e73400","#bd2a00"],
		orange: ["#ffa244","#fd7f00","#dd6f00","#bf6000","#9b4e00"],
		pink: ["#ff96cb","#ff70b8","#ff3a9d","#ee0077","#c30062"],
		orangeToRed: ["#ffdf04","#ffbe04","#ff9a03","#ff6d02","#ff2c01"]

	},
	*/

interface Entry {
	date: string;
	intensity?: number;
	color?: string | number;
	content?: string;
}

interface CalendarData {
	year?: number;
	colors?: {
		[index: string | number]: {
			[index: number]: string;
		};
	};
	entries?: Array<Entry>;

}

const calendarData: CalendarData = {
	year: 2022,
	colors: {
		default: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
		blue: ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"],
	},
	entries: [
		{
			date: "2022-12-31",
			intensity: 5,
			color: "blue",
			content: "blue",
		},
		{
			date: "2022-12-31",
			intensity: 5,
			color: "blue",
			content: "blue",
		},
	]
}

export default class HeatmapCalendar extends Plugin {

	settings: HeatmapCalendarSettings;

	daysIntoYear(date: Date): number {
		return (
			(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
				Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
		)
	}

	clamp(input: number, min: number, max: number): number {
		return input < min ? min : input > max ? max : input;
	}

	map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
		const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
		return this.clamp(mapped, out_min, out_max);
	}

	async onload() {

		await this.loadSettings();

		//@ts-ignore
		window.renderHeatmapCalendar = (el: HTMLElement, calendarData: CalendarData): void => {

			const year = calendarData.year ?? this.settings.year
			const colors = calendarData.colors ?? this.settings.colors
			const calEntries = calendarData.entries ?? this.settings.entries
			console.log("calEntries", calEntries)
			
			const intensities: Array<number> = []
			calEntries.forEach(e => e.intensity && intensities.push(e.intensity))

			const minimumIntensity = Math.min(...intensities) ?? 1;
			const averageIntensity = intensities.reduce((a,b) => a + b, 0) / intensities.length ?? 3
			const maximumIntensity = Math.max(...intensities) ?? 5;
/*
			if(intensities.length != 0){
				
			}else{
				
			}
			
*/
			console.log("minimumIntensity",minimumIntensity)
			console.log("maximumIntensity",maximumIntensity)
			console.log("averageIntensity",averageIntensity)




			const mappedEntries: Array<Entry> = []
			calEntries.forEach(e => {
				if (new Date(e.date).getFullYear() == year) {
					const newEntry = { ...e }
					newEntry.intensity = newEntry.intensity ?? this.settings.defaultEntryIntensity

					newEntry.intensity = Math.round(this.map(newEntry.intensity, minimumIntensity, maximumIntensity,1,5))
					//if (!newEntry.intensity) { newEntry.intensity = this.settings.defaultEntryIntensity }
					mappedEntries[this.daysIntoYear(new Date(e.date))] = newEntry

				}
			})

			console.log("mappedEntries",mappedEntries)

			const firstDayOfYear = new Date(Date.UTC(year, 0, 1))
			let numberOfEmptyDaysBeforeYearBegins = (firstDayOfYear.getDay() + 5) % 6
			let boxes = ""
			while (numberOfEmptyDaysBeforeYearBegins) {
				boxes += `<li style="background-color: transparent"></li>`
				numberOfEmptyDaysBeforeYearBegins--
			}
			const lastDayOfYear = new Date(Date.UTC(year, 11, 31))
			const numberOfDays = this.daysIntoYear(lastDayOfYear) //eg 365 or 366
			//console.log("mappedEntries",mappedEntries)
			for (let day = 1; day <= numberOfDays; day++) {

				let background_color, content = ""

				if (mappedEntries[day]) {
					if (mappedEntries[day].color) {
						//console.log("if (mappedEntries[day].color) {")
						background_color = colors[mappedEntries[day].color][mappedEntries[day].intensity - 1]
						console.log("has color: ", background_color)
					} else {
						//background_color = colors.default[mappedEntries[day].intensity - 1]
						background_color = colors[Object.keys(colors)[0]][mappedEntries[day].intensity - 1]
						
						console.log("default color: ", background_color)
					}
					if (mappedEntries[day].content) {
						content = mappedEntries[day].content
					}
					boxes += `<li style="background-color:${background_color};">${content}</li>`
				} else {
					boxes += `<li></li>`
				}
			}
			const html = `
				<div class="heatmap-calendar-graph">
				<div class="heatmap-calendar-year">${String(year).slice(2)}</div>
				<ul class="heatmap-calendar-months">
					<li>Jan</li>
					<li>Feb</li>
					<li>Mar</li>
					<li>Apr</li>
					<li>May</li>
					<li>Jun</li>
					<li>Jul</li>
					<li>Aug</li>
					<li>Sep</li>
					<li>Oct</li>
					<li>Nov</li>
					<li>Dec</li>
				</ul>
				<ul class="heatmap-calendar-days">
					<li>Mon</li>
					<li>Tue</li>
					<li>Wed</li>
					<li>Thu</li>
					<li>Fri</li>
					<li>Sat</li>
					<li>Sun</li>
				</ul>
				<ul class="heatmap-calendar-boxes">
					${boxes}
				</ul>
				</div>
			`
			console.log(html)
			el.insertAdjacentHTML("beforeend", html);
		}


	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}



