# Heatmap Calendar plugin for Obsidian

Visualize your daily note data in a full year "heatmap like" calendar similar to the github activity calendar using this [Obsidian](https://obsidian.md/) plugin.  

Usefull for tracking your goal progress for such things as excersice, finances, passions, vices, social interactions, project progression etc.   

Tracking and visualizing the data can help motivate you to start doing the things you want to do, or even more – motivate you to not stop doing it once you've started.

It's intended to be used alongside [DataviewJS](https://blacksmithgu.github.io/obsidian-dataview/) – but could probably be used standalone or with other plugins as well.  

![heatmap calendar examples](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap-calendar-examples.jpg?raw=true)


## How it works:

First annotate the data you want to track in your daily notes, see [Dataview annotation documentation](https://blacksmithgu.github.io/obsidian-dataview/data-annotation/).  
Then, create a [DataviewJS block](https://blacksmithgu.github.io/obsidian-dataview/api/intro/) to collect the data using the DataviewJS api.  
Lastly, pass the data into Heatmap Calendar using  **renderHeatmapCalendar()** 

![heatmap calendar example 1](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap-calendar-howto1.png?raw=true)
![heatmap calendar example 2](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap-calendar-howto2.png?raw=true)

## Use:

This plugin attaches a single function to the window object in obsidian – **renderHeatmapCalendar(this.container, calendarData)**  
It's intended to be used inside of a dataviewjs block like below. You use dataview to collect the data, and this plugin to display it.
Heatmap Calendar does not do any querying of the notes/data, you need DataviewJs or something similar to do that first.

```javascript
dataviewjs
const calendarData = { 
	year: 2022, // optional, defaults to current year
	colors: {   // optional, defaults to green
	  blue:        ["#8cb9ff","#69a3ff","#428bff","#1872ff","#0058e2"], // this first entry is considered default
	  green:       ["#c6e48b","#7bc96f","#49af5d","#2e8840","#196127"],
	  red:         ["#ff9e82","#ff7b55","#ff4d1a","#e73400","#bd2a00"],
	  orange:      ["#ffa244","#fd7f00","#dd6f00","#bf6000","#9b4e00"],
	  pink:        ["#ff96cb","#ff70b8","#ff3a9d","#ee0077","#c30062"],
	  orangeToRed: ["#ffdf04","#ffbe04","#ff9a03","#ff6d02","#ff2c01"]
	},
	entries: [] // populated in the DataviewJS loop below
}

for(let page of dv.pages('"daily notes"').where(p=>p.exercise).sort(p=>p.file.name)){ //DataviewJS stuff

	calendarData.entries.push({
		date: page.file.name, // needs to be in format YYYY-MM-DD
		intensity: page.exercise, // optional, what color intensity to use for entry, will autoscale. Default 4 (1-5)
		content: "🏋️", // optional, adds text to the date cell (use at own risk)
		color: "orange", // optional, reference from your colors object. If no color is supplied; colors[0] is used
	})

}

/**
* param1  HTMLElement   this gives the plugin a reference to render the calendar at
* param2  CalendarData  your calendar object, with settings/data for the calendar
*/
renderHeatmapCalendar(this.container, calendarData)

```
  
## Colors:
Adding new colors are optional, but if supplied, the first index will be considered default.
You can use multiple colors in the same calendar, just use different colors for different events.  
   


## Notes:
- Download the [EXAMPLE VAULT](https://github.com/Richardsl/heatmap-calendar-obsidian/tree/master/EXAMPLE_VAULT) to try out the examples.  
- Not tested on Mobile/small screens
- Doesn't adapt to darkmode yet
- Intended to be used with DataviewJS, but could possibly be used standalone or with other plugins as its just a global function
- Week starts on Monday, not configurable yet
- Date format is YYYY-MM-DD, if your daily note filname is something else, you can use JS to change it in the loop
- I used [leonardocolor.io](https://leonardocolor.io) to create the example color gradients


# Changelog:

## [0.1.1] - 2022-03-18

### Fixed
- fix major date problem where year would render with incorrect number of days for different timezones [issue#4](https://github.com/Richardsl/heatmap-calendar-obsidian/issues/4).
- fix problem with certain entries not showing up in correct month
- fix grid cells not scaling correctly with browser width, especially content in grid cells


## [0.1.0] - 2022-02-23
- initial release
