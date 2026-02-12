export interface ISchedule {
  day: string; // "Monday", "Tuesday", etc.
  start_time: string; // "08:00"
  end_time: string; // "09:30"
  room?: string;
}