class Location {
  constructor(data) {
    this.id = data.id;
    this.city = data.city;
    this.state = data.state;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    Location.all.push(this);
  }
}

Location.all = [];
