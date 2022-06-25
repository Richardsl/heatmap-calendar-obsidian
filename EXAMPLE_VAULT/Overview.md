# Overview
*(PS. Disable safe mode and install "Dataview" and "Heatmap Calendar" plugins for the examples below to work. You may have to restart Obsidian).*

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

dv.span("**💸 Money Spent 💸**")

const calendarData = {
    entries: [],
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
    entries: [],
    showCurrentDayBorder: false
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

dv.span("**🔗Writing **- Dont break the chain! 🔗🔗🔗🔗")

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

dv.span("**👫 Social tracker 🧑‍🤝‍🧑**")

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

```dataviewjs

dv.span("** 😊 Mood  😥**")

const hue1 = 13 //red
const hue2 = 132 //green

const calendarData = { 
    year: 2022,
    intensityScaleStart: 1,
    intensityScaleEnd: 9,
    colors: {   // optional, defaults to green
        red2green: [
            `hsl(${hue1}, 100%, 37%)`,     // 1 - darkest red
            `hsl(${hue1}, 100%, 50%)`,     // 2 - 
            `hsl(${hue1}, 100%, 60%)`,     // 3 - 
            `hsl(${hue1}, 100%, 77%)`,     // 4 - lightest red
            `hsl(0, 0%, 80%)`,             // 5 - neutral gray
            `hsl(${hue2*0.7}, 70%, 72%)`,  // 6 - lightest green
            `hsl(${hue2*0.85}, 43%, 56%)`, // 7 - 
            `hsl(${hue2}, 49%, 36%)`,      // 8 - 
            `hsl(${hue2}, 59%, 24%)`,      // 9 - darkest green
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



