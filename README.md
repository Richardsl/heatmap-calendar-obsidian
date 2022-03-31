# Heatmap Calendar plugin for Obsidian

Visualise your data in a full year heatmap calendar similar to the github activity calendar using this [Obsidian](https://obsidian.md/) plugin.  

Usefull for tracking your progress for various things such as exercise, finance, passion, vice, social, project progression etc.   

Tracking and visualizing the data can help motivate you to start doing the things you want to do, or even more – motivate you to continue once you've started!

It's intended to be used alongside [DataviewJS](https://blacksmithgu.github.io/obsidian-dataview/), but could be used standalone or with other plugins as well, as all the plugin does, is add the function ***renderHeatmapCalendar()*** to the global namespace.

![heatmap calendar examples](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap-calendar-examples.jpg?raw=true)


## Use:

1. Annotate the data you want to track in your daily notes (see [Dataview annotation documentation](https://blacksmithgu.github.io/obsidian-dataview/data-annotation/)) 
2. Create a [DataviewJS block](https://blacksmithgu.github.io/obsidian-dataview/api/intro/) wherever you want the Heatmap Calendar to display.  
3. Collect the data you want to display using [DataviewJS](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/)
4. Pass the data into Heatmap Calendar using  **renderHeatmapCalendar()** 

![heatmap calendar example](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap-calendar-howto3.jpg?raw=true)


## Example Code:

~~~javascript
\```dataviewjs
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
~~~

  
## Colors:
You don't need to supply any colors, the calendar uses green by default, just like Github.   
If you do supply colors, the first index will be considered the default color.

Add a custom color to each event by specifying the name you gave the color, if you want.
You can even use multiple colors in the same calendar, just use different colors for different events.  
   
The color schemes used in the examples was created at [leonardocolor.io](https://leonardocolor.io).

## Intensity:
The "Intensity" means which intensity of color to use, for instance from light-green to dark-green.  
The plugin currently supports five intensities, and they will be distributed between the highest and lowest number you pass to "intensity".  
***e.g*** if the number range 0-100 is used, numbers between 1-20 would map to the ligthest color, 40-60 would map to mid intensity color, and 80-100 would map to max intensity.  

Dataview's time variables are supported without any conversion, as they return milliseconds på default.  
***e.g***  **[time:: 1 hours, 35 minutes] => intensity: page.time**

## Notes:
- Download the [EXAMPLE VAULT](https://github.com/Richardsl/heatmap-calendar-obsidian/tree/master/EXAMPLE_VAULT) to try out the examples.  
- Not tested on phone/small screens
- Doesn't adapt to darkmode yet
- Week starts on Monday, not configurable yet
- Date format is YYYY-MM-DD, if your daily note filename is something else, [you can use JS to change it in the loop](https://github.com/Richardsl/heatmap-calendar-obsidian/discussions/2)


---

### Changelog:

#### [0.1.1] - 2022-03-18

##### Fixed
- fix major date problem where year would render with incorrect number of days for different timezones [issue#4](https://github.com/Richardsl/heatmap-calendar-obsidian/issues/4).
- fix problem with certain entries not showing up in correct month
- fix grid cells not scaling correctly with browser width, especially content in grid cells


#### [0.1.0] - 2022-02-23
- initial release
