class DateWriter {
  public date: string;

  public constructor(date: Date) {
    this.date = this.writeDate(date);
  }

  private writeDate(date: Date): string {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();
    let hour = d.getHours().toString();
    let minute = d.getMinutes().toString();
    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    if (hour.length < 2) {
      hour = "0" + hour;
    }
    if (minute.length < 2) {
      minute = "0" + minute;
    }
    return `${year}-${month}-${day} ${hour}:${minute}`;
    //return ([year, month, day].join("-")).toString();
  }
}

export { DateWriter };
