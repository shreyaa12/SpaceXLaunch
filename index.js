var request = new XMLHttpRequest()
function load() {
  loader.style.visibility = 'visible'
  document.getElementById('no_data').style.visibility = 'hidden'
  let url = 'https://api.spacexdata.com/v3/launches?limit=100'
  filters.forEach(filter => {
    if (filter.isApplied) {
      url += `&${filter.key}=${filter.value}`
    }
  });
  request.open('GET', url, true)
  request.send()
}

let years = ['2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020']
years.reverse();
let filters = [
  {
    key: 'launch_year',
    isApplied: false,
    value: ''
  },
  {
    key: 'launch_success',
    isApplied: false,
    value: ''
  },
  {
    key: 'land_success',
    isApplied: false,
    value: ''
  }
]

const loader = document.getElementById('loader')
const app = document.getElementById('root')
const fill = document.getElementById('fill')

const container = document.createElement('div')
container.setAttribute('class', 'container')
const container1 = document.createElement('div')
container1.setAttribute('class', 'container')

// app.appendChild(logo)
app.appendChild(container)
fill.appendChild(container1)

years.forEach(yr => {
  const yearCard = document.createElement('div')
  yearCard.setAttribute('class', 'filterItem')
  yearCard.setAttribute('id', yr)
  const h1 = document.createElement('launch_year')
  h1.textContent = yr
  yearCard.setAttribute('onclick', 'yearFilter(this.id)')

  container1.appendChild(yearCard)
  yearCard.appendChild(h1)
})



request.onload = function () {
  // Begin accessing JSON data here
  container.innerHTML=''
  var data = JSON.parse(this.response)
  if (request.status >= 200 && request.status < 400) {
    loader.style.visibility = 'hidden'
    if(data.length && data.length>0) {
      data.forEach((mission) => {
      
        const card = document.createElement('div')
        card.setAttribute('class', 'card')

        const img = document.createElement('img')
        img.src = mission.links.mission_patch_small

        const h1 = document.createElement('h1')
        h1.textContent = mission.mission_name + ' #' + mission.flight_number

        const missionIds = document.createElement('p')
        const missionIdsTitle = document.createElement('span')
        missionIdsTitle.textContent = 'Mission Ids: '
        missionIdsTitle.setAttribute('class', 'content-normal16')
        const missionIdsValue = document.createElement('ul')
        mission.mission_id.forEach(id => {
          const i = document.createElement("li")
          i.textContent = id
          missionIdsValue.appendChild(i)
        })
        missionIdsValue.setAttribute('class', 'content-normal14')
        missionIds.appendChild(missionIdsTitle)
        missionIds.appendChild(missionIdsValue)

        const year = document.createElement('p')
        const yearTitle = document.createElement('span')
        yearTitle.textContent = 'Launch Year: '
        yearTitle.setAttribute('class', 'content-normal16')
        const yearValue = document.createElement('span')
        yearValue.textContent = `${mission.launch_year}`
        yearValue.setAttribute('class', 'content-normal14')
        year.appendChild(yearTitle)
        year.appendChild(yearValue)

        const successLaunch = document.createElement('p')
        const launchTitle = document.createElement('span')
        launchTitle.textContent = 'Successful Launch: '
        launchTitle.setAttribute('class', 'content-normal16')
        const launchValue = document.createElement('span');
        // for(var i=0;i<mission.length;i++){
          if(mission.launch_success == true){
            mission.launch_success = 'Yes';
            // console.log("mission.launch_success",mission.launch_success)
          }else if(mission.launch_success == false){
            mission.launch_success = 'No';
            // console.log("mission.launch_success",mission.launch_success)
          }
        // }
        launchValue.textContent = `${mission.launch_success}`
        launchValue.setAttribute('class', 'content-normal14')
        successLaunch.appendChild(launchTitle)
        successLaunch.appendChild(launchValue)

        const successLand = document.createElement('p')
        const landTitle = document.createElement('span')
        landTitle.textContent = 'Successful landing: '
        landTitle.setAttribute('class', 'content-normal16')
        const landValue = document.createElement('span')
        const cores = mission.rocket.first_stage.cores
        const core = cores[cores.length - 1]
        if (core.land_success !== null) {
          if(core.land_success == true){
            core.land_success = 'Yes'
          }else{
            landValue.textContent = 'No'
          }
          landValue.textContent = `${core.land_success}`
        } else {
          landValue.textContent = '--'
        }

        landValue.setAttribute('class', 'content-normal14')
        successLand.appendChild(landTitle)
        successLand.appendChild(landValue)

        container.appendChild(card)

        card.appendChild(img)
        card.appendChild(h1)
        card.appendChild(missionIds)
        card.appendChild(year)
        card.appendChild(successLaunch)
        card.appendChild(successLand)
        
      })
    } else {
      document.getElementById('no_data').style.visibility = 'visible'
    }
  } else {
    const errorMessage = document.createElement('marquee')
    errorMessage.textContent = `SpaceX, it's not working!`
    app.appendChild(errorMessage)
    loader.style.visibility = 'hidden'
  }
}


function yearFilter(id) {
  loader.style.visibility = 'visible'
  document.getElementById('no_data').style.visibility = 'hidden'
  container.innerHTML=''
  filters.forEach(filter => {
    if (filter.key === 'launch_year') {
      if(filter.isApplied === true) {
        document.getElementById(filter.value).style.background = '#C0EC83'
        if(filter.value === id){
          filter.value = '',
          filter.isApplied = false
        } else {
          document.getElementById(id).style.background='#96CC39';
          filter.value = id
        }
      } else {
        document.getElementById(id).style.background='#96CC39';
        filter.isApplied = true
        filter.value = id
      }      
    }
  })
  load()
}

function launchFilter(id) {
  
  // let filterValue = document.getElementById("launchYN");
  // console.log(filterValue.checked);
  loader.style.visibility = 'visible'
  document.getElementById('no_data').style.visibility = 'hidden'
  container.innerHTML=''
  let filterValue = id.substring(id.indexOf('-')+1, id.length)
  console.log(filterValue);
  filters.forEach(filter => {
    if (filter.key === 'launch_success') {
      if(filter.isApplied === true) {
        document.getElementById(`launch-${filterValue}`).style.background = '#C0EC83'
        if(filter.value === filterValue.checked) {
          filter.value = ''
          filter.isApplied = false
        } else {
          document.getElementById(id).style.background='#96CC39';
          filter.value = filterValue.checked
        }
      } else {
        document.getElementById(id).style.background='#96CC39';
        filter.isApplied = true
        filter.value = filterValue.checked
      }      
    }
  })
  load()
}

function landingFilter(id) {
  loader.style.visibility = 'visible'
  container.innerHTML=''
  let filterValue = id.substring(id.indexOf('-')+1, id.length)
  filters.forEach(filter => {
    if (filter.key === 'land_success') {
      if(filter.isApplied === true) {
        document.getElementById(`landing-${filterValue}`).style.background = '#C0EC83'
        if(filter.value === filterValue) {
          filter.value = ''
          filter.isApplied = false
        } else {
          document.getElementById(id).style.background='#96CC39';
          filter.value = filterValue
        }
      } else {
        document.getElementById(id).style.background='#96CC39';
        filter.isApplied = true
        filter.value = filterValue
      }      
    }
  })
  load()
}
