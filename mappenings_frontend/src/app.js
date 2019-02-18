class App {
  attachEventListeners() {

    let foundLocation
    let foundWhen

    let addEventForm = document.querySelector('#add-event-form')
    let addEventDiv = document.querySelector('.add-event')

    let mymap = L.map('map-area').setView([39, -96], 4);
    let markersLayerGroup = L.layerGroup()

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiamJtZW5hc2hpIiwiYSI6ImNqcWZyYXFvZTU1ejg0MmxnNXQxaHZwYTMifQ.Uvhck3cxhndzZdytkylSPw'
      }).addTo(mymap);

    const fetchEventsByLocation = (when, location) => {
      fetch(`http://localhost:3000/api/v1/whens/${when.id}/locations/${location.id}/events`)
      .then(response => response.json())
      .then(data => {
        document.querySelector('.location-info').innerHTML = `<h3>Events in ${location.city}, ${location.state}</h3>
                                                              <ul id="list-of-events"></ul>`
        data.forEach(e => {
          document.querySelector('#list-of-events').innerHTML += `
                                                                  <li data-id="${e.id}">${e.title}</li>`
        })
      })
    }



    document.addEventListener('submit', (event) => {
      event.preventDefault()
      if (event.target.id === "date-submit") {
        foundWhen = When.all.find(when => when.date.includes(`${document.querySelector('#start').value}`))
        if (foundWhen !== undefined) {
          fetch(`http://localhost:3000/api/v1/whens/${foundWhen.id}/locations`)
          .then(response => response.json())
          .then(data => {
            mymap.on('click', e => {
              document.querySelector('#list-of-events').innerHTML = ''
              document.querySelector('.event-info').innerHTML = `<h3>Event Info</h3>`
              document.querySelector('#add-event-form').reset()
              let infoPopup = L.popup()
              infoPopup.setLatLng(e.latlng).setContent("Add An Event To This Location Below!").openOn(mymap)
              document.querySelector('#lat-input').value = e.latlng.lat
              document.querySelector('#long-input').value = e.latlng.lng
            });
            markersLayerGroup.clearLayers()
            document.querySelector('#add-event-form').reset()
            document.querySelector('#list-of-events').innerHTML = ''
            document.querySelector('.event-info').innerHTML = `<h3>Event Info</h3>`
            data.forEach(location => {
              let marker = L.marker([location.latitude, location.longitude]);
              markersLayerGroup.addLayer(marker).addTo(mymap)
              marker.on('click', e => {
                marker.bindPopup(`${location.city}, ${location.state}`).openPopup();
                document.querySelector('#list-of-events').innerHTML = ''
                document.querySelector('.event-info').innerHTML = `<h3>Event Info</h3>`
                document.querySelector('#city-input').value = location.city
                document.querySelector('#state-input').value = location.state
                document.querySelector('#lat-input').value = location.latitude
                document.querySelector('#long-input').value = location.longitude
                fetchEventsByLocation(foundWhen, location)
              })
            })
          })
        }
        else {
          let year = document.querySelector('#start').value.split("-")[0]
          let month = document.querySelector('#start').value.split("-")[1] - 1
          let day = document.querySelector('#start').value.split("-")[2]
          fetch(`http://localhost:3000/api/v1/whens`, {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'Accept':'application/json'
            },
            body: JSON.stringify({
              date: new Date(year, month, day)
            })
          })
          .then(response => response.json())
          .then(data => {
            When.all.push(data)
            mymap.on('click', e => {
              document.querySelector('#list-of-events').innerHTML = ''
              document.querySelector('.event-info').innerHTML = `<h3>Event Info</h3>`
              document.querySelector('#add-event-form').reset()
              let infoPopup = L.popup()
              infoPopup.setLatLng(e.latlng).setContent("Add An Event To This Location Below!").openOn(mymap)
              document.querySelector('#lat-input').value = e.latlng.lat
              document.querySelector('#long-input').value = e.latlng.lng
            });
            markersLayerGroup.clearLayers()
            document.querySelector('#add-event-form').reset()
            document.querySelector('#list-of-events').innerHTML = ''
            document.querySelector('.event-info').innerHTML = `<h3>Event Info</h3>`
          })
        }
      }
    })

    document.addEventListener('submit', (event) => {
      if (event.target.id === "add-event-form") {
        foundWhen = When.all.find(when => when.date.includes(`${document.querySelector('#start').value}`))
        foundLocation = Location.all.find(location => location.latitude == `${document.querySelector('#lat-input').value}`)
        if (foundLocation !== undefined) {
          fetch(`http://localhost:3000/api/v1/events`, {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'Accept':'application/json'
            },
            body: JSON.stringify({
              when_id: foundWhen.id,
              location_id: foundLocation.id,
              title: document.querySelector('#event-title-input').value,
              info: document.querySelector('#event-info-input').value,
              img_url: document.querySelector('#img-url-input').value
            })
          })
          .then(response => response.json())
          .then(data => {
            Event.all.push(data)
            fetchEventsByLocation(foundWhen, foundLocation)
            event.target.reset()
          })
        }
        else {
          fetch(`http://localhost:3000/api/v1/locations`, {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'Accept':'application/json'
            },
            body: JSON.stringify({
              city: document.querySelector('#city-input').value,
              state: document.querySelector('#state-input').value,
              latitude: document.querySelector('#lat-input').value,
              longitude: document.querySelector('#long-input').value
            })
          })
          .then(response => response.json())
          .then(data => {
            Location.all.push(data)
            let newMarker = L.marker([data.latitude, data.longitude])
            markersLayerGroup.addLayer(newMarker)
            newMarker.on('click', e => {

              newMarker.bindPopup(`${data.city}, ${data.state}`).openPopup();
              document.querySelector('#city-input').value = data.city
              document.querySelector('#state-input').value = data.state
              document.querySelector('#lat-input').value = data.latitude
              document.querySelector('#long-input').value = data.longitude
              fetchEventsByLocation(foundWhen, data)
            })
            fetch(`http://localhost:3000/api/v1/events`, {
              method: 'POST',
              headers: {
                'Content-Type':'application/json',
                'Accept':'application/json'
              },
              body: JSON.stringify({
                when_id: foundWhen.id,
                location_id: data.id,
                title: document.querySelector('#event-title-input').value,
                info: document.querySelector('#event-info-input').value,
                img_url: document.querySelector('#img-url-input').value
              })
            })
            .then(response => response.json())
            .then(event_data => {
              Event.all.push(event_data)
              event.target.reset()
            })
          })
        }
      }
    })

    document.addEventListener('click', (event) => {
      if (event.target.parentNode.id === "list-of-events") {
        let foundEvent = Event.all.find(e => e.id == event.target.dataset.id)
        document.querySelector('.event-info').innerHTML = `<div id="event-info-deets"><h3>${foundEvent.title}</h3>
                                                            <p>${foundEvent.info}</p></div>
                                                            <div id="event-info-image"><img src="${foundEvent.img_url}" width="200px" height="180px">
                                                            </div>
                                                            <div id="buttons" data-id="${foundEvent.id}">
                                                              <button id="edit-event" class="btn btn-warning btn-sm">Edit</button>
                                                              <button id="delete-event" class="btn btn-danger btn-sm">Delete</button>
                                                            </div>`
      }
      else if (event.target.id === "edit-event") {
        let foundEvent = Event.all.find(e => e.id == event.target.parentNode.dataset.id);
        addEventDiv.innerHTML = `<h3>Edit Event:</h3>
                                <form id="edit-event-form" data-id="${foundEvent.id}" action="index.html" method="POST">
                                <label for="edit-title">Event Title: </label>
                                <input id="edit-title" class="form-control" type="text" name="edit-title" value="${foundEvent.title}">
                                <label for="edit-info">Event Info: </label>
                                <textarea id="edit-info" class="form-control" type="text" name="edit-info">${foundEvent.info}</textarea>
                                <label for="edit-image">Image: </label>
                                <input id="edit-image" class="form-control" type="text" name="edit-image" value="${foundEvent.img_url}">
                                <br>
                                <button id="submit-edits" type="submit" name="button" class="btn btn-success btn-sm">Submit</button>
                              </form>`
      }
      else if (event.target.id === "delete-event") {
        let foundEvent = Event.all.find(e => e.id == event.target.parentNode.dataset.id);
        let foundWhen = When.all.find(when => when.id == foundEvent['when']['id'])
        let foundLocation = Location.all.find(location => location.id == foundEvent['location']['id'])
        document.querySelector('.event-info').innerHTML = ''
        fetch(`http://localhost:3000/api/v1/events/${foundEvent.id}`, {
          method: 'DELETE'
        })
        .then(() => fetchEventsByLocation(foundWhen, foundLocation))
      }
    })

    document.addEventListener('submit', e => {
      e.preventDefault()
      if (e.target.id === "edit-event-form") {
        let foundEvent = Event.all.find(e => e.id == event.target.dataset.id);
        document.querySelector('.event-info').innerHTML = ''
        fetch(`http://localhost:3000/api/v1/events/${foundEvent.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type':'application/json',
            'Accept':'application/json'
          },
          body: JSON.stringify({
            title: document.querySelector('#edit-title').value,
            info: document.querySelector('#edit-info').value,
            img_url: document.querySelector('#edit-image').value
          })
        })
        .then(response => response.json())
        .then(data => {
          document.querySelector('.event-info').innerHTML = `<div id="event-info-deets"><h3>${data.title}</h3>
                                                            <p>${data.info}</p></div>
                                                            <div id="event-info-image"><img src="${data.img_url}" width="200px" height="180px">
                                                            </div>
                                                            <div id="buttons" data-id="${data.id}">
                                                              <button id="edit-event" class="btn btn-warning btn-sm">Edit</button>
                                                              <button id="delete-event" class="btn btn-danger btn-sm">Delete</button>
                                                            </div>`
        })
        addEventDiv.innerHTML = `<h3>Add Event:</h3>
        <form id="add-event-form" action="index.html" method="post">
            <label for="city">City:</label>
            <input type="text" class="form-control" id="city-input" name="city" value="">
            <label for="state">State:</label>
            <input type="text" class="form-control" id="state-input" name="state" value="">
            <label for="latitude">Latitude:</label>
            <input type="text" class="form-control" id="lat-input" name="latitude" value="">
            <label for="longitude">Longitude:</label>
            <input type="text" class="form-control" id="long-input" name="longitude" value="">
            <label for="event-title">Event Title:</label>
            <input type="text" class="form-control" id="event-title-input" name="event-title" value="">
            <label for="event-info">Event Info:</label>
            <textarea class="form-control" id="event-info-input" name="event-info" value=""></textarea>
            <label for="img-url">Image:</label>
            <input type="text" class="form-control" id="img-url-input" name="img-url" value=""><br>
          <button type="submit" class="btn btn-success" name="button">Submit</button>
        </form>`
      }
    })


  }
}
