import { Plugin } from 'obsidian';

// TODO: blande farga om man bruka to farga i en event?
// TODO: custom fixed scale istedenfor automap
// CouldDO: laga visuell scala under, me min max avg text
// CouldDO: konne legge til so monge farga man vil i colors array 

interface CalendarData {
	year: number
	colors: {
		[index: string | number]: {
			[index: number]: string
		}
	}
	entries: Entry[]
	showCurrentDayBorder: boolean
	defaultEntryIntensity: number
}
interface Entry {
	date: string
	intensity?: number
	color?: string | number
	content?: string
}
const DEFAULT_SETTINGS: CalendarData = {
	year: new Date().getUTCFullYear(),
	colors: {
		default: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"]
	},
	entries: [{ date: "1900-01-01" }],
	showCurrentDayBorder: true,
	defaultEntryIntensity: 4,
}
export default class HeatmapCalendar extends Plugin {

	settings: CalendarData;

	/**
     * Returns a number representing how many days into the year the supplied date is. 
	 * Example: first of january is 1, third of february is 34 (31+3) 
     * @param date
     */
	getHowManyDaysIntoYear(date: Date): number {
		return (
			(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
				Date.UTC(date.getUTCFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
		)
	}
	getHowManyDaysIntoYearLocal(date: Date): number {
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
			const showCurrentDayBorder = calendarData.showCurrentDayBorder ?? this.settings.showCurrentDayBorder

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
					mappedEntries[this.getHowManyDaysIntoYear(new Date(e.date))] = newEntry
				}
			})

			const firstDayOfYear = new Date(Date.UTC(year, 0, 1))
			let numberOfEmptyDaysBeforeYearBegins = (firstDayOfYear.getUTCDay() + 6) % 7

			interface Box {
				backgroundColor?: string;
				date?: string;
				content?: string;
				classNames?: string
			}

			let boxes: Array<Box> = []

			while (numberOfEmptyDaysBeforeYearBegins) {
				boxes.push({ backgroundColor: "transparent" })
				numberOfEmptyDaysBeforeYearBegins--
			}
			const lastDayOfYear = new Date(Date.UTC(year, 11, 31))
			const numberOfDaysInYear = this.getHowManyDaysIntoYear(lastDayOfYear) //eg 365 or 366
			const todaysDayNumberLocal = this.getHowManyDaysIntoYearLocal(new Date())

			for (let day = 1; day <= numberOfDaysInYear; day++) {

				const box: Box = {}

				if(day === todaysDayNumberLocal && showCurrentDayBorder) {
					box.classNames = "today"
				}

				if (mappedEntries[day]) {
					const entry = mappedEntries[day]

					box.date = entry.date

					if(entry.content) box.content = entry.content

					const currentDayColors = entry.color ? colors[entry.color] : colors[Object.keys(colors)[0]]
					box.backgroundColor = currentDayColors[entry.intensity - 1]
					
				} 
				boxes.push(box)
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
					text: e.content,
					attr: {
						...e.backgroundColor && { style: `background-color: ${e.backgroundColor};` },
					},
					cls: e.classNames,
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



