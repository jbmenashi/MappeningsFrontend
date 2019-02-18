document.addEventListener('DOMContentLoaded', () => {

  const app = new App();
  app.attachEventListeners();

  const whensURL = 'http://localhost:3000/api/v1/whens'
  let allWhens = []

  const fetchWhens = () => {
    fetch(whensURL)
    .then(response => response.json())
    .then(data => {
      allWhens = data
      showAllWhens(data)
    })
  }

  const showAllWhens = (allWhens) => {
    allWhens.forEach(when => {
      const newWhen = new When(when)
    })
  }

  const locationsURL = 'http://localhost:3000/api/v1/locations'
  let allLocations = []

  const fetchLocations = () => {
    fetch(locationsURL)
    .then(response => response.json())
    .then(data => {
      allLocations = data
      showAllLocations(data)
    })
  }

  const showAllLocations = (allLocations) => {
    allLocations.forEach(location => {
      const newLocation = new Location(location)
    })
  }

  const eventsURL = 'http://localhost:3000/api/v1/events'
  let allEvents = []

  const fetchEvents = () => {
    fetch(eventsURL)
    .then(response => response.json())
    .then(data => {
      allEvents = data
      showAllEvents(data)
    })
  }

  const showAllEvents = (allEvents) => {
    allEvents.forEach(event => {
      const newEvent = new Event(event)
    })
  }


  fetchWhens()
  fetchLocations()
  fetchEvents()

});
