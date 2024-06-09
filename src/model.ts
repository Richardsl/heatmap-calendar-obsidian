export interface CalendarData {
    year: number
    colors:
        | {
              [index: string | number]: string[]
          }
        | string
    entries: Entry[]
    showCurrentDayBorder: boolean
    defaultEntryIntensity: number
    intensityScaleStart: number
    intensityScaleEnd: number
}

export interface CalendarSettings extends CalendarData {
    colors: {
        [index: string | number]: string[]
    }
    weekStartDay: number
}

export interface Intensity {
    default: number
    startScale: number
    endScale: number
}

export interface Entry {
    date: string
    intensity?: number
    color: string
    content: string | HTMLElement
}

export interface Box {
    backgroundColor?: string
    date?: string
    content?: string
    classNames?: string[]
}
