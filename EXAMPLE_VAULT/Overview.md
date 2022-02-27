# Overview
(PS. install "Dataview" and "Heatmap Calendar" plugins for the examples below to work)

```dataviewjs

dv.span("**🏋️ Exercise 🏋️**")

const calendarData = {
    year: 2022,
    colors: {
        red: ["#ff9e82","#ff7b55","#ff4d1a","#e73400","#bd2a00"]
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.exercise).sort(p=>p.file.name)){
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.exercise
    })
       
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**💸 Money Spent 💸**")

const calendarData = {
    entries: []
}

 
for(let page of dv.pages('"daily notes"').where(p=>p.moneySpent).sort(p=>p.file.name)){

    calendarData.entries.push({
        date: page.file.name,
        intensity: page.moneySpent
    })  
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**🍺 Alcohol Consumption 🍺**")

const calendarData = {
    year: 2022,
    colors: {
        blue: ["#ffdf04","#ffbe04","#ff9a03","#ff6d02","#ff2c01"]
    },
    entries: [] 
}

for(let page of dv.pages('"daily notes"').where(p=>p.alcohol).sort(p=>p.file.name)){
	//dv.paragraph(page.file.name + " Alcohol units: " + page.alcohol)
    
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.alcohol
    })  
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**Writing - Dont break the chain! 🔗🔗**")

const calendarData = {
    year: 2022,
    colors: {
        white: ["#fff","#fff","#fff","#fff","#fff"],
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.writing).sort(p=>p.file.name)){
	 
    calendarData.entries.push({
        date: page.file.name,
        intensity: 5,
        content: "🔗"
    })   
}
	
renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs
//
// Using multiple colors for different variations of entry
//

dv.span("**Time spent with my friend Greg in 2022 :)**")

const calendarData = {
    year: 2022,
    colors: {
        blue: ["#8cb9ff","#69a3ff","#428bff","#1872ff","#0058e2"],
        pink: ["#ff96cb","#ff70b8","#ff3a9d","#ee0077","#c30062"],
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.social).sort(p=>p.file.name)){

    let color = ""
    if(page.social.greg.initiative == "incoming"){color="pink"}
    
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.social.greg.time,
        color: color
    })
       
}

renderHeatmapCalendar(this.container, calendarData)

```

##### Calories?

