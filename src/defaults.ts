import { CalendarSettings } from 'model'

export const GITHUB_GREEN = ['#c6e48b', '#7bc96f', '#49af5d', '#2e8840', '#196127']
export const DEFAULT_SETTINGS: CalendarSettings = {
    year: new Date().getFullYear(),
    colors: { default: GITHUB_GREEN },
    entries: [{ date: '1900-01-01', color: '#7bc96f', intensity: 5, content: '' }],
    showCurrentDayBorder: true,
    defaultEntryIntensity: 4,
    intensityScaleStart: 1,
    intensityScaleEnd: 5,
    weekStartDay: 1,
}
