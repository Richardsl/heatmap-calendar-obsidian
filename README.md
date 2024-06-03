# Heatmap Calendar plugin for Obsidian

Visualize your data in a heatmap calendar similar to the github activity calendar using this [Obsidian](https://obsidian.md/) plugin.  

Useful for tracking progress towards various things such as exercise, finance, passion, vices, social, project progression etc.   

It's intended to be used alongside [Obsidian Dataview](https://blacksmithgu.github.io/obsidian-dataview/), but could be used standalone or with other plugins if you know some javascript.

<p>
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap_examples_dark.gif?raw=true">
      <source media="(prefers-color-scheme: light)" srcset="https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap_examples_light.gif?raw=true">
      <img alt="Shows a black logo in light color mode and a white one in dark color mode." src="https://user-images.githubusercontent.com/25423296/163456779-a8556205-d0a5-45e2-ac17-42d089e3c3f8.png">
    </picture>
</p>

&nbsp;
## Howto

1. Annotate the data you want to track in your daily notes (see [Dataview annotation documentation](https://blacksmithgu.github.io/obsidian-dataview/data-annotation/)) 

2. Create a [DataviewJS block](https://blacksmithgu.github.io/obsidian-dataview/api/intro/) where you want the Heatmap Calendar to display.  

3. Collect the data you want to display using [DataviewJS](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/)

4. Pass the data into Heatmap Calendar using  **renderHeatmapCalendar()** 

*Visualized Concept:*
![heatmap calendar example](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/heatmap-calendar-howto3.jpg?raw=true)


## Full Example Code:

~~~javascript
\```dataviewjs
dv.span("** 😊 Title  😥**") /* optional ⏹️💤⚡⚠🧩↑↓⏳📔💾📁📝🔄📝🔀⌨️🕸️📅🔍✨ */
const calendarData = {
    year: 2022,  // (optional) defaults to current year
    colors: {    // (optional) defaults to green
        blue:        ["#8cb9ff", "#69a3ff", "#428bff", "#1872ff", "#0058e2"], // first entry is considered default if supplied
        green:       ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"],
        red:         ["#ff9e82", "#ff7b55", "#ff4d1a", "#e73400", "#bd2a00"],
        orange:      ["#ffa244", "#fd7f00", "#dd6f00", "#bf6000", "#9b4e00"],
        pink:        ["#ff96cb", "#ff70b8", "#ff3a9d", "#ee0077", "#c30062"],
        orangeToRed: ["#ffdf04", "#ffbe04", "#ff9a03", "#ff6d02", "#ff2c01"]
    },
    showCurrentDayBorder: true, // (optional) defaults to true
    defaultEntryIntensity: 4,   // (optional) defaults to 4
    intensityScaleStart: 10,    // (optional) defaults to lowest value passed to entries.intensity
    intensityScaleEnd: 100,     // (optional) defaults to highest value passed to entries.intensity
    entries: [],                // (required) populated in the DataviewJS loop below
}

//DataviewJS loop
for (let page of dv.pages('"daily notes"').where(p => p.exercise)) {
    //dv.span("<br>" + page.file.name) // uncomment for troubleshooting
    calendarData.entries.push({
        date: page.file.name,     // (required) Format YYYY-MM-DD
        intensity: page.exercise, // (required) the data you want to track, will map color intensities automatically
        content: "🏋️",           // (optional) Add text to the date cell
        color: "orange",          // (optional) Reference from *calendarData.colors*. If no color is supplied; colors[0] is used
    })
}

renderHeatmapCalendar(this.container, calendarData)
```
~~~
 
<details>
    <summary>PS. remove the backslash \ at the very beginning of the example</summary>
    <br>
    The backslash at the very beginning of the example is included just for styling the readme.md file on github.com
    <br><br>
</details>

&nbsp;

## Technical Explanation
All the plugin does, is add the function ***renderHeatmapCalendar()*** to the global namespace of you vault.

**"this.container"** is passed as the first argument because the plugin needs to know where to render the calendar. You don't have to worry about this.

"renderHeatmapCalendar()" then takes **"calendarData"** as the secondary argument. This is the javascript object you have to create yourself in order to give plugin instructions and data. Most of the properties are optional, but you have to supply an entries array as an absolute minimum:

**absolute minimum code example:**
~~~javascript
\```dataviewjs

const calendarData = {
    entries: [],                
}

renderHeatmapCalendar(this.container, calendarData)

```
~~~
 
<details>
    <summary>PS. remove the backslash \ at the very beginning of the example</summary>
    <br>
    The backslash at the very beginning of the example is included just for styling the readme.md file on github.com
    <br><br>
</details>

---

## Colors:

<details>
<summary>You don't need to supply any colors, the calendar uses green by default, just like Github.</summary>
<br>
But if you DO decide to supply colors to *calendarData.colors* array then it works like this:
<br>
<b>Default: green (no color specified)</b>

![heatmap calendar custom colors example](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/colors_defaultColorExample.png?raw=true)
<br>

<b>Custom Color: red</b>

![heatmap calendar custom colors example](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/colors_defaultColorExample.png?raw=true)




<i>The color schemes used in the examples were created at [leonardocolor.io](https://leonardocolor.io).</i>
<br>

Styling Background (days without any data):

Use Obsidian's built in "CSS snippets" for custom styling including styling the days without any data aka the background cells.  
See [snippet examples](https://github.com/Richardsl/heatmap-calendar-obsidian/tree/master/EXAMPLE_VAULT/.obsidian/snippets) for how to change the empty days. 
<br>

![heatmap calendar custom colors example](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/colors_cssSnippetsBeforeAfterEmptyDays.png?raw=true)

<br>
</details>

--- 


SLETT FLYTT OMSKRIV
Add a custom color to each data-entry by specifying the name you gave the color in calendarData.colors.
You can even use multiple colors in the same calendar, just use different colors for different entries.

/SLETT FLYTT OMSKRIV


IKKE I BRUK
![heatmap calendar custom colors example](https://github.com/Richardsl/heatmap-calendar-obsidian/blob/master/github-images/colors.png?raw=true)

/IKKE I BRUK

&nbsp;

## Styling:
Use Obsidian CSS snippets for custom styling.  
See [snippet examples](https://github.com/Richardsl/heatmap-calendar-obsidian/tree/master/EXAMPLE_VAULT/.obsidian/snippets).

&nbsp;


### Adding global colors:

You can also add a color scheme which will be available everywhere via the Settings panel.

In order to do so go to `Obsidian Settings > Heatmap Calendar`, you will see a list of available colors, and you can add your own. You must specify a “Color name” by which you will reference it in your render call, and provide a valid array of colors.

When you do so, you can now reference your scheme everywhere by passing your name to the `colors` option. For example, let's say you have defined a new color called `githubGreen`. Now, in your code, you can reference it like so:

~~~javascript
\```dataviewjs
const calendarData = {
	color: "githubGreen",
	entries: [], // <- your entries
}

renderHeatmapCalendar(this.container, calendarData)
```
~~~

&nbsp;

## Intensity:
The "Intensity" means which intensity of color to use, for example from light-green to dark-green, 
and they will be distributed between the highest and lowest number you pass to "intensity".  
If the number range 0-100 is used, numbers between 1-20 would map to the lightest color, 40-60 would map to mid intensity color, and 80-100 would map to max intensity.
You can add more intensities in order to increase color resolution; simply supply more colors to **calendarData.colors.yourcolor**

Dataview's time variables are supported without any conversion, as they return milliseconds by default.  
**[time:: 1 hours, 35 minutes] => intensity: page.time**

&nbsp;


## Notes:
- See the [EXAMPLE VAULT](https://github.com/Richardsl/heatmap-calendar-obsidian/tree/master/EXAMPLE_VAULT) if you want to test out the examples.
- Week starts on Monday, not configurable yet
- Date format is YYYY-MM-DD, if your daily note filename is something else, [you can use JS to change it in the loop](https://github.com/Richardsl/heatmap-calendar-obsidian/discussions/2)

&nbsp;

## Development (Windows):
 ```npm run dev``` - will start TS to JS transpiler and automatically copy the JS/CSS/manifest files to the example vault whenever they are modified.  
 Installing https://github.com/pjeby/hot-reload is recommended to avoid restarting obsidian after every change, but remember to add a **.hot-reload** file to EXAMPLE_VAULT/.obsidian/plugins/heatmap-calendar/

&nbsp;

---

### What's New:

**Version [0.6.0] - 2023-04-12**
- Feature: Add ability to define global colors via settings @sunyatasattva pull #74
- Feature: Add more versatile custom styling of the "content" passed to date cell @sunyatasattva pull #73

**Version [0.5.0] - 2022-06-30**
- Feature: Add darkmode support

**Version [0.4.0] - 2022-06-25**
- Feature: Add hover preview feature courtesy of @arsenty from issue #12.  
to enable - add **content: await dv.span(`[](${page.file.name})`)** to entries, and enable **Settings** -> **Core Plugins** -> **Page Preview**.   
Optionally install plugin [Metatable](https://github.com/arnau/obsidian-metatable) to display metadata/frontmatter in the preview window aswell.  
See examples for more details

**Version [0.3.0] - 2022-06-25**
- Feature: Can add more intensities in order to increase color resolution. simply supply more colors to **calendarData.colors.yourcolor**
- Feature: Can set custom range on the intensity scaling using *intensityScaleStart* and *intensityScaleEnd*
- Bugfix: Entries from other years would show up in the calendar

**Version [0.2.0] - 2022-06-05**
- Feature: Add border around todays box to indicate what day it is. Can be removed by setting *showCurrentDayBorder* to false
- Feature: Add better development solution/workflow by using automated file copying instead of symlinks

**Version [0.1.1] - 2022-03-18**
- Bugfix: fix major date problem where year would render with incorrect number of days for different timezones [issue#4](https://github.com/Richardsl/heatmap-calendar-obsidian/issues/4).
- Bugfix: fix problem with certain entries not showing up in the correct month
- Bugfix: fix grid cells not scaling correctly with browser width, especially content in grid cells

**Version [0.1.0] - 2022-02-23**
- initial release
