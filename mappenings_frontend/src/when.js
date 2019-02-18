class When {
  constructor(data) {
    this.id = data.id;
    this.date = data.date;
    When.all.push(this);
  }
}

When.all = [];
