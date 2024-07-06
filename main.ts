import { Plugin, } from 'obsidian'
import HeatmapCalendarSettingsTab from "settings"

interface CalendarData {
	year: number
	colors: {
		[index: string | number]: string[]
	} | string
	entries: Entry[]
	showCurrentDayBorder: boolean
	defaultEntryIntensity: number
	intensityScaleStart: number
	intensityScaleEnd: number
	separateMonths: boolean
}

interface CalendarSettings extends CalendarData {
	colors: {
		[index: string | number]: string[]
	},
	weekStartDay: number,
	separateMonths: boolean,
}

interface Entry {
	date: string
	intensity?: number
	color: string
	content: string
}
const DEFAULT_SETTINGS: CalendarSettings = {
	year: new Date().getFullYear(),
	colors: {
		default: ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127",],
	},
	entries: [{ date: "1900-01-01", color: "#7bc96f", intensity: 5, content: "",},],
	showCurrentDayBorder: true,
	defaultEntryIntensity: 4,
	intensityScaleStart: 1,
	intensityScaleEnd: 5,
	weekStartDay: 1,
	separateMonths: false,
}
export default class HeatmapCalendar extends Plugin {

	settings: CalendarSettings

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
	/**
	 * Removes HTMLElements passed as entry.content and outside of the displayed year from rendering above the calendar
	 */
	removeHtmlElementsNotInYear(entries: Entry[], year: number) {
		const calEntriesNotInDisplayedYear = entries.filter(e => new Date(e.date).getFullYear() !== year) ?? this.settings.entries
		//@ts-ignore
		calEntriesNotInDisplayedYear.forEach(e => e.content instanceof HTMLElement && e.content.remove())
	}

	clamp(input: number, min: number, max: number): number {
		return input < min ? min : input > max ? max : input
	}

	map(current: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
		const mapped: number = ((current - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
		return this.clamp(mapped, outMin, outMax)
	}

	getWeekdayShort(dayNumber: number): string {
		return new Date(1970, 0, dayNumber + this.settings.weekStartDay + 4).toLocaleDateString('en-US', { weekday: 'short' });
	}

	async onload() {

		await this.loadSettings()

		this.addSettingTab(new HeatmapCalendarSettingsTab(this.app, this))

		//@ts-ignore
		window.renderHeatmapCalendar = (el: HTMLElement, calendarData: CalendarData): void => {

			const year = calendarData.year ?? this.settings.year
			const colors = typeof calendarData.colors === "string"
				? this.settings.colors[calendarData.colors]
					? { [calendarData.colors]: this.settings.colors[calendarData.colors], }
					: this.settings.colors
				: calendarData.colors ?? this.settings.colors

			this.removeHtmlElementsNotInYear(calendarData.entries, year)

			const calEntries = calendarData.entries.filter(e => new Date(e.date + "T00:00").getFullYear() === year) ?? this.settings.entries

			const showCurrentDayBorder = calendarData.showCurrentDayBorder ?? this.settings.showCurrentDayBorder

			const defaultEntryIntensity = calendarData.defaultEntryIntensity ?? this.settings.defaultEntryIntensity

			const intensities = calEntries.filter(e => e.intensity).map(e => e.intensity as number)
			const minimumIntensity = intensities.length ? Math.min(...intensities) : this.settings.intensityScaleStart
			const maximumIntensity = intensities.length ? Math.max(...intensities) : this.settings.intensityScaleEnd
			const intensityScaleStart = calendarData.intensityScaleStart ?? minimumIntensity
			const intensityScaleEnd = calendarData.intensityScaleEnd ?? maximumIntensity

			const separateMonths = calendarData.separateMonths ?? this.settings.separateMonths

			const mappedEntries: Entry[] = []
			calEntries.forEach(e => {
				const newEntry = {
					intensity: defaultEntryIntensity,
					...e,
				}
				const colorIntensities = typeof colors === "string"
					? this.settings.colors[colors]
					: colors[e.color] ?? colors[Object.keys(colors)[0]]

				const numOfColorIntensities = Object.keys(colorIntensities).length

				if(minimumIntensity === maximumIntensity && intensityScaleStart === intensityScaleEnd) newEntry.intensity = numOfColorIntensities
				else newEntry.intensity = Math.round(this.map(newEntry.intensity, intensityScaleStart, intensityScaleEnd, 1, numOfColorIntensities))

				mappedEntries[this.getHowManyDaysIntoYear(new Date(e.date))] = newEntry
			})

			const firstDayOfYear = new Date(Date.UTC(year, 0, 1))
			let numberOfEmptyDaysBeforeYearBegins = (firstDayOfYear.getUTCDay() + 7 - this.settings.weekStartDay) % 7

			interface Box {
				backgroundColor?: string;
				date?: string;
				content?: string;
				classNames?: string[];
			}

			const boxes: Array<Box> = []

			while (numberOfEmptyDaysBeforeYearBegins) {
				boxes.push({ backgroundColor: "transparent", })
				numberOfEmptyDaysBeforeYearBegins--
			}
			const lastDayOfYear = new Date(Date.UTC(year, 11, 31))
			const numberOfDaysInYear = this.getHowManyDaysIntoYear(lastDayOfYear) //eg 365 or 366
			const todaysDayNumberLocal = this.getHowManyDaysIntoYearLocal(new Date())

			for (let day = 1; day <= numberOfDaysInYear; day++) {

				const box: Box = {
                    classNames: [],
                }

				// determine the date and month for the current box
				const currentDate = new Date(year, 0, day);
				
          		const month = currentDate.toLocaleString('en-us', { month: 'short' });

				// Add padding at the beginning of February to December
				if (separateMonths && day > 31) {
					const day_in_month = +currentDate.toLocaleString("en-us", { day: "numeric" });
					if (day_in_month === 1) {
						for (let i = 0; i < 7; i++) {
							boxes.push({ backgroundColor: "transparent" });
						}
					}
				}

				// Add the month class name to the box
          		box.classNames?.push(`month-${month.toLowerCase()}`); // e.g., "month-jan", "month-feb", etc.

				if (day === todaysDayNumberLocal && showCurrentDayBorder) box.classNames?.push("today")

				if (mappedEntries[day]) {
					box.classNames?.push("hasData")
					const entry = mappedEntries[day]

					box.date = entry.date

					if (entry.content) box.content = entry.content

					const currentDayColors = entry.color ? colors[entry.color] : colors[Object.keys(colors)[0]]
					box.backgroundColor = currentDayColors[entry.intensity as number - 1]

				} else box.classNames?.push("isEmpty")
				boxes.push(box)
			}

			const heatmapCalendarGraphDiv = createDiv({
				cls: "heatmap-calendar-graph",
				parent: el,
			})

			createDiv({
				cls: "heatmap-calendar-year",
				text: String(year).slice(2),
				parent: heatmapCalendarGraphDiv,
			})

			const heatmapCalendarMonthsUl = createEl("ul", {
				cls: "heatmap-calendar-months",
				parent: heatmapCalendarGraphDiv,
			})

			createEl("li", { text: "Jan", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Feb", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Mar", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Apr", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "May", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Jun", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Jul", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Aug", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Sep", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Oct", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Nov", parent: heatmapCalendarMonthsUl, })
			createEl("li", { text: "Dec", parent: heatmapCalendarMonthsUl, })

			const heatmapCalendarDaysUl = createEl("ul", {
				cls: "heatmap-calendar-days",
				parent: heatmapCalendarGraphDiv,
			})

			for (let i = 0; i < 7; i++) {
				createEl("li", { text: this.getWeekdayShort(i), parent: heatmapCalendarDaysUl, })
			}

			const heatmapCalendarBoxesUl = createEl("ul", {
				cls: "heatmap-calendar-boxes",
				parent: heatmapCalendarGraphDiv,
			})
			if (separateMonths) {
				heatmapCalendarBoxesUl.className += " separate-months";
			}

			boxes.forEach(e => {
				const entry = createEl("li", {
					attr: {
						...e.backgroundColor && { style: `background-color: ${e.backgroundColor};`, },
						...e.date && { "data-date": e.date, },
					},
					cls: e.classNames,
					parent: heatmapCalendarBoxesUl,
				})

				createSpan({
					cls: "heatmap-calendar-content",
					parent: entry,
					text: e.content,
				})
			})

		}
	}

	onunload() {

	}

	async loadSettings() {
		console.log( "heyoh", await this.loadData() );
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
	}

	async saveSettings() {
		await this.saveData(this.settings)
	}
}
