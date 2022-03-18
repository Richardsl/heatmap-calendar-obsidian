import { Plugin } from 'obsidian';

// TODO: blande farga om man bruka to farga i en event?
// TODO: custom fixed scale istedenfor automap
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
	year: new Date().getUTCFullYear(),
	defaultEntryIntensity: 4,
	colors: {
		default: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"]
	},
	entries: [{ date: "1900-01-01" }]
}

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

export default class HeatmapCalendar extends Plugin {

	settings: HeatmapCalendarSettings;

	daysIntoYear(date: Date): number {
		return (
			(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
				Date.UTC(date.getUTCFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
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

			const intensities: Array<number> = []
			calEntries.forEach(e => {
				if (e.intensity) {
					intensities.push(e.intensity)
				}
			})

			const minimumIntensity = Math.min(...intensities) ?? 1;
			//const averageIntensity = intensities.reduce((a,b) => a + b, 0) / intensities.length ?? 3
			const maximumIntensity = Math.max(...intensities) ?? 5;

			const mappedEntries: Array<Entry> = []

			calEntries.forEach(e => {
				if (new Date(e.date).getUTCFullYear() == year) {

					const newEntry = { ...e }
					newEntry.intensity = e.intensity ?? this.settings.defaultEntryIntensity;

					if (minimumIntensity == maximumIntensity) {
						newEntry.intensity = 5;
					} else {
						newEntry.intensity = Math.round(this.map(newEntry.intensity, minimumIntensity, maximumIntensity, 1, 5))
					}
					mappedEntries[this.daysIntoYear(new Date(e.date))] = newEntry
				}
			})

			const firstDayOfYear = new Date(Date.UTC(year, 0, 1))
			let numberOfEmptyDaysBeforeYearBegins = (firstDayOfYear.getUTCDay() + 6) % 7

			interface box {
				backgroundColor: string;
				content?: string;
			}

			let boxes: Array<box> = []
			while (numberOfEmptyDaysBeforeYearBegins) {
				boxes.push({ backgroundColor: "transparent" })
				numberOfEmptyDaysBeforeYearBegins--
			}
			const lastDayOfYear = new Date(Date.UTC(year, 11, 31))
			const numberOfDays = this.daysIntoYear(lastDayOfYear) //eg 365 or 366

			for (let day = 1; day <= numberOfDays; day++) {

				let background_color, content = ""

				if (mappedEntries[day]) {
					if (mappedEntries[day].color) {
						background_color = colors[mappedEntries[day].color][mappedEntries[day].intensity - 1]
					} else {
						background_color = colors[Object.keys(colors)[0]][mappedEntries[day].intensity - 1]
					}
					if (mappedEntries[day].content) {
						content = mappedEntries[day].content
					}
					boxes.push({ backgroundColor: background_color, content: content })
				} else {
					boxes.push({ backgroundColor: "" })
				}
			}

			const heatmapCalendarGraphDiv = createDiv({
				cls: "heatmap-calendar-graph",
				parent: el
			})

			createDiv({
				cls: "heatmap-calendar-year",
				text: String(year).slice(2),
				parent: heatmapCalendarGraphDiv
			})

			const heatmapCalendarMonthsUl = createEl("ul", {
				cls: "heatmap-calendar-months",
				parent: heatmapCalendarGraphDiv
			})

			createEl("li", { text: "Jan", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Feb", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Mar", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Apr", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "May", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Jun", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Jul", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Aug", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Sep", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Oct", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Nov", parent: heatmapCalendarMonthsUl })
			createEl("li", { text: "Dec", parent: heatmapCalendarMonthsUl })

			const heatmapCalendarDaysUl = createEl("ul", {
				cls: "heatmap-calendar-days",
				parent: heatmapCalendarGraphDiv
			})

			createEl("li", { text: "Mon", parent: heatmapCalendarDaysUl })
			createEl("li", { text: "Tue", parent: heatmapCalendarDaysUl })
			createEl("li", { text: "Wed", parent: heatmapCalendarDaysUl })
			createEl("li", { text: "Thu", parent: heatmapCalendarDaysUl })
			createEl("li", { text: "Fri", parent: heatmapCalendarDaysUl })
			createEl("li", { text: "Sat", parent: heatmapCalendarDaysUl })
			createEl("li", { text: "Sun", parent: heatmapCalendarDaysUl })

			const heatmapCalendarBoxesUl = createEl("ul", {
				cls: "heatmap-calendar-boxes",
				parent: heatmapCalendarGraphDiv
			})

			boxes.forEach(e => {
				createEl("li", {
					text: e.content || "",
					attr: { "style": `background-color: ${e.backgroundColor || ""}` },
					parent: heatmapCalendarBoxesUl,
				})
			})

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



