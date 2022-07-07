# Overview

```dataviewjs

dv.span("**🏋️ Exercise 🏋️**")

const calendarData = {
    year: 2022,
    colors: {
        red: ["#ff9e82","#ff7b55","#ff4d1a","#e73400","#bd2a00",]
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.exercise)){
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.exercise
    })
       
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**🏋️ Exercise 🏋️** (Green if you reached your goal of 45 minutes)")

const calendarData = {
    year: 2022,
    intensityScaleEnd: 45 * 60 * 1000, //convert 45minutes to millis
    colors: {
        red: ["#ff9e82","#ff7b55","#ff4d1a","#e73400","#bd2a00",
        "hsl(132, 90%, 40%)"] //last one green
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.exercise)){
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
    entries: [],
}

 
for(let page of dv.pages('"daily notes"').where(p=>p.moneySpent)){

    calendarData.entries.push({
        date: page.file.name,
        intensity: page.moneySpent
    })  
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**💸 Money Spent 💸** (11 intensities instead of 5)")

const calendarData = {
    entries: [],
    colors: {
        oldGithubGreen11:[
            "hsl(65, 83%, 88%)",
            "hsl(70, 77%, 78%)",
            "hsl(80, 62%, 72%)",
            "hsl(95, 52%, 66%)",
            "hsl(112, 45%, 61%)",
            "hsl(125, 43%, 56%)",
            "hsl(132, 41%, 49%)",
            "hsl(132, 45%, 43%)",
            "hsl(132, 49%, 36%)",
            "hsl(132, 54%, 29%)", 
            "hsl(132, 59%, 24%)",
        ]
    },
}

 
for(let page of dv.pages('"daily notes"').where(p=>p.moneySpent)){

    calendarData.entries.push({
        date: page.file.name,
        intensity: page.moneySpent
    })  
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**💸 Money Spent 💸** (custom scale from 250 to 450)")

const calendarData = {
    entries: [],
    intensityScaleStart: 250,
    intensityScaleEnd: 450
}

 
for(let page of dv.pages('"daily notes"').where(p=>p.moneySpent)){

    calendarData.entries.push({
        date: page.file.name,
        intensity: page.moneySpent
    })  
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**💸 Money Spent 💸** (11 intensities + scale from 150)")

const calendarData = {
    entries: [],
    intensityScaleStart: 150,
    colors: {
        oldGithubGreen11:[
            "hsl(65, 83%, 88%)","hsl(70, 77%, 78%)",
            "hsl(80, 62%, 72%)","hsl(95, 52%, 66%)",
            "hsl(112, 45%, 61%)","hsl(125, 43%, 56%)",
            "hsl(132, 41%, 49%)","hsl(132, 45%, 43%)",
            "hsl(132, 49%, 36%)","hsl(132, 54%, 29%)", 
            "hsl(132, 59%, 24%)",
        ]
    },
}

 
for(let page of dv.pages('"daily notes"').where(p=>p.moneySpent)){

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
    entries: [],
    showCurrentDayBorder: false
}

for(let page of dv.pages('"daily notes"').where(p=>p.alcohol)){
	dv.paragraph(page.file.name + " Alcohol units: " + page.alcohol)
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.alcohol
    })  
}

renderHeatmapCalendar(this.container, calendarData)

```
```dataviewjs

dv.span("**🍺 Alcohol Consumption 🍺** (everything over 8 is full intensity red)")

const calendarData = {
    year: 2022,
    colors: {
        blue: ["#ffdf04","#ffbe04","#ff9a03","#ff6d02","#ff2c01"]
    },
    entries: [],
    showCurrentDayBorder: false,
    intensityScaleEnd: 8,
}

for(let page of dv.pages('"daily notes"').where(p=>p.alcohol)){
	//dv.paragraph(page.file.name + " Alcohol units: " + page.alcohol)
    
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.alcohol
    })  
}

renderHeatmapCalendar(this.container, calendarData)

```

```dataviewjs

dv.span("**🔗Writing **- Dont break the chain! 🔗🔗🔗🔗")

const calendarData = {
    year: 2022,
    colors: {
        white: ["#fff","#fff","#fff","#fff333","#fff"],
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.writing)){
	 
    calendarData.entries.push({
        date: page.file.name,
        intensity: 4,
        content: "🔗"
    })   
}

//console.log(calendarData)
	
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

for(let page of dv.pages('"daily notes"').where(p=>p.social)){

    let color = ""
    if(page.social.greg.initiative == "incoming"){color="pink"}
    
    //dv.span("page.file.name: "+page.file.name)
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.social.greg.time,
        color: color
    })
       
}

renderHeatmapCalendar(this.container, calendarData)

```

```dataviewjs

dv.span("** 😊 Mood  😥**")

const hue1 = 13 //red
const hue2 = 132 //green

const calendarData = { 
    year: 2022,
    intensityScaleStart: 1,
    intensityScaleEnd: 9,
    colors: {   // optional, defaults to green
        red2greenX21: [
            `hsl(${hue1}, 100%, 37%)`,     // 1 - darkest red (worst mood)
            `hsl(${hue1}, 100%, 50%)`,     // 2 - 
            `hsl(${hue1}, 100%, 60%)`,     // 3 - 
            `hsl(${hue1}, 100%, 77%)`,     // 4 - lightest red
            `hsl(0, 0%, 80%)`,             // 5 - gray (neutral mood)
            `hsl(${hue2*0.7}, 70%, 72%)`,  // 6 - lightest green
            `hsl(${hue2*0.85}, 43%, 56%)`, // 7 - 
            `hsl(${hue2}, 49%, 36%)`,      // 8 - 
            `hsl(${hue2}, 59%, 24%)`,      // 9 - darkest green (best mood)
        ],
    },
    entries: [] // populated in the DataviewJS loop below
}

for(let page of dv.pages('"daily notes"').where(p=>p.mood)){ 

    calendarData.entries.push({
        date: page.file.name, 
        intensity: page.mood,
    })
      
}


renderHeatmapCalendar(this.container, calendarData)


```




## For testing
```dataviewjs

dv.span("**test intensities 0to5**")
const heat = ["#1C0298","#2500D9","#6F04D7","#C911CF","#FD06B2","#FD5C81","#FD7A48","#FD9A75","#FDD276","#FCE4B2"]

let calendarData = {
    year: 2022,
    colors: {
        red: heat
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.intensity0to5)){
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.intensity0to5
    })
       
}

renderHeatmapCalendar(this.container, calendarData)


dv.span("**test intensities 0to5ish**")

calendarData = {
    year: 2022,
    colors: {
        red: heat
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.intensity0to5ish)){
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.intensity0to5ish
    })
       
}

renderHeatmapCalendar(this.container, calendarData)



dv.span("**test intensities 0to10**")

calendarData = {
    year: 2022,
    colors: {
        red: heat
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.intensity0to10)){
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.intensity0to10
    })
       
}

renderHeatmapCalendar(this.container, calendarData)


dv.span("**test intensities 0to25**")

calendarData = {
    year: 2022,
    colors: {
        red: heat
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.intensity0to25)){
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.intensity0to25
    })
       
}

renderHeatmapCalendar(this.container, calendarData)


dv.span("**test intensities 0to25 + scale end 15**")

calendarData = {
    year: 2022,
    intensityScaleEnd: 15,
    colors: {
        red: heat
    },
    entries: []
}

for(let page of dv.pages('"daily notes"').where(p=>p.intensity0to25)){
    calendarData.entries.push({
        date: page.file.name,
        intensity: page.intensity0to25
    })
       
}

renderHeatmapCalendar(this.container, calendarData)

```

