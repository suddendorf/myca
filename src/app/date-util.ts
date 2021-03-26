export class DateUtil {
  static getDayName(day: Date): string {
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[day.getDay()];
  }
  static getMonthName(day: Date): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    return monthNames[day.getMonth()];
  }
}
