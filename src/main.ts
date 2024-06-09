import { DEFAULT_SETTINGS } from 'defaults'
import { Box, CalendarData, CalendarSettings, Entry } from 'model'
import { Plugin } from 'obsidian'
import HeatmapCalendarSettingsTab from 'settings'

declare global {
    interface Window {
        renderHeatmapCalendar: (el: HTMLElement, calendarData: CalendarData) => void
    }
}

export default class HeatmapCalendar extends Plugin {
    /**
     * Returns a number representing how many days into the year the supplied date is.
     * Example: first of january is 1, third of february is 34 (31+3)
     * @param date
     */
    getHowManyDaysIntoYear(date: Date): number {
        const currentUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
        const firstDayOfYear = Date.UTC(date.getUTCFullYear(), 0, 0)
        const dayInMillis = 24 / 60 / 60 / 1000
        return (currentUTC - firstDayOfYear) / dayInMillis
    }

    getHowManyDaysIntoYearLocal(date: Date): number {
        const currentUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        const firstDayOfYear = Date.UTC(date.getFullYear(), 0, 0)
        const dayInMillis = 24 / 60 / 60 / 1000
        return (currentUTC - firstDayOfYear) / dayInMillis
    }

    /**
     * Removes HTMLElements passed as entry.content and outside of the displayed year from rendering above the calendar
     */
    removeHtmlElementsNotInYear(entries: Entry[], year: number): void {
        entries
            .filter((e: Entry) => new Date(e.date).getFullYear() !== year)
            .forEach((e: Entry) => e.content instanceof HTMLElement && e.content.remove())
    }

    clamp(input: number, min: number, max: number): number {
        return input < min ? min : input > max ? max : input
    }

    map(current: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        const mapped: number = ((current - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
        return this.clamp(mapped, outMin, outMax)
    }

    getWeekdayShort(weekStartDay: number, dayNumber: number): string {
        return new Date(1970, 0, dayNumber + weekStartDay + 4).toLocaleDateString('en-US', {
            weekday: 'short',
        })
    }

    async onload(): Promise<void> {
        const settings = await this.loadSettings()

        this.addSettingTab(new HeatmapCalendarSettingsTab(this.app, this, settings))

        window.renderHeatmapCalendar = (el: HTMLElement, calendarData: CalendarData): void => {
            const year = calendarData.year ?? settings.year
            const colors =
                typeof calendarData.colors === 'string'
                    ? settings.colors[calendarData.colors]
                        ? { [calendarData.colors]: settings.colors[calendarData.colors] }
                        : settings.colors
                    : calendarData.colors ?? settings.colors

            this.removeHtmlElementsNotInYear(calendarData.entries, year)

            const calEntries =
                calendarData.entries.filter((e: Entry) => new Date(e.date + 'T00:00').getFullYear() === year) ??
                settings.entries

            const showCurrentDayBorder = calendarData.showCurrentDayBorder ?? settings.showCurrentDayBorder

            const defaultEntryIntensity = calendarData.defaultEntryIntensity ?? settings.defaultEntryIntensity

            const intensities = calEntries
                .map((e: Entry) => e.intensity)
                .filter((intensity): intensity is number => intensity !== undefined)

            const minimumIntensity = intensities.length ? Math.min(...intensities) : settings.intensityScaleStart
            const maximumIntensity = intensities.length ? Math.max(...intensities) : settings.intensityScaleEnd
            const intensityScaleStart = calendarData.intensityScaleStart ?? minimumIntensity
            const intensityScaleEnd = calendarData.intensityScaleEnd ?? maximumIntensity

            const mappedEntries: Entry[] = []
            calEntries.forEach((e: Entry) => {
                const newEntry = {
                    intensity: defaultEntryIntensity,
                    ...e,
                }
                const colorIntensities =
                    typeof colors === 'string'
                        ? settings.colors[colors]
                        : colors[e.color] ?? colors[Object.keys(colors)[0]]

                const numOfColorIntensities = Object.keys(colorIntensities).length

                if (minimumIntensity === maximumIntensity && intensityScaleStart === intensityScaleEnd)
                    newEntry.intensity = numOfColorIntensities
                else {
                    newEntry.intensity = Math.round(
                        this.map(newEntry.intensity, intensityScaleStart, intensityScaleEnd, 1, numOfColorIntensities)
                    )
                }

                mappedEntries[this.getHowManyDaysIntoYear(new Date(e.date))] = newEntry
            })

            const firstDayOfYear = new Date(Date.UTC(year, 0, 1))
            let numberOfEmptyDaysBeforeYearBegins = (firstDayOfYear.getUTCDay() + 7 - settings.weekStartDay) % 7

            const boxes: Array<Box> = []

            while (numberOfEmptyDaysBeforeYearBegins) {
                boxes.push({ backgroundColor: 'transparent' })
                numberOfEmptyDaysBeforeYearBegins--
            }
            const lastDayOfYear = new Date(Date.UTC(year, 11, 31))
            const numberOfDaysInYear = this.getHowManyDaysIntoYear(lastDayOfYear) //eg 365 or 366
            const todaysDayNumberLocal = this.getHowManyDaysIntoYearLocal(new Date())

            for (let day = 1; day <= numberOfDaysInYear; day++) {
                const box: Box = { classNames: [] }

                // determine the date and month for the current box
                const currentDate = new Date(year, 0, day)

                const month = currentDate.toLocaleString('en-us', { month: 'short' })

                // Add the month class name to the box
                box.classNames?.push(`month-${month.toLowerCase()}`) // e.g., "month-jan", "month-feb", etc.

                if (day === todaysDayNumberLocal && showCurrentDayBorder) box.classNames?.push('today')

                if (mappedEntries[day]) {
                    box.classNames?.push('hasData')
                    const entry = mappedEntries[day]

                    box.date = entry.date

                    if (entry.content !== undefined) box.content = entry.content.toString()

                    const currentDayColors = entry.color ? colors[entry.color] : colors[Object.keys(colors)[0]]
                    if (entry.intensity !== undefined) box.backgroundColor = currentDayColors[entry.intensity - 1]
                } else box.classNames?.push('isEmpty')
                boxes.push(box)
            }

            const heatmapCalendarGraphDiv = createDiv({
                cls: 'heatmap-calendar-graph',
                parent: el,
            })

            createDiv({
                cls: 'heatmap-calendar-year',
                text: String(year).slice(2),
                parent: heatmapCalendarGraphDiv,
            })

            const heatmapCalendarMonthsUl = createEl('ul', {
                cls: 'heatmap-calendar-months',
                parent: heatmapCalendarGraphDiv,
            })

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            months.forEach((month: string) => createEl('li', { text: month, parent: heatmapCalendarMonthsUl }))

            const heatmapCalendarDaysUl = createEl('ul', {
                cls: 'heatmap-calendar-days',
                parent: heatmapCalendarGraphDiv,
            })

            for (let i = 0; i < 7; i++)
                createEl('li', { text: this.getWeekdayShort(settings.weekStartDay, i), parent: heatmapCalendarDaysUl })

            const heatmapCalendarBoxesUl = createEl('ul', {
                cls: 'heatmap-calendar-boxes',
                parent: heatmapCalendarGraphDiv,
            })

            boxes.forEach((e) => {
                const entry = createEl('li', {
                    attr: {
                        ...(e.backgroundColor && { style: `background-color: ${e.backgroundColor};` }),
                        ...(e.date && { 'data-date': e.date }),
                    },
                    cls: e.classNames,
                    parent: heatmapCalendarBoxesUl,
                })

                createSpan({
                    cls: 'heatmap-calendar-content',
                    parent: entry,
                    text: e.content,
                })
            })
        }
    }

    onunload(): void {}

    async loadSettings(): Promise<CalendarSettings> {
        const settings: CalendarSettings = await this.loadData()
        console.log('heyoh', settings)
        return Object.assign({}, DEFAULT_SETTINGS, settings)
    }

    async saveSettings(settings: CalendarSettings): Promise<void> {
        await this.saveData(settings)
    }
}
