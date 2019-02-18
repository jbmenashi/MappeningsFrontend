class Event {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.info = data.info
    this.img_url = data.img_url
    Event.all.push(this)
  }
}

Event.all = []
