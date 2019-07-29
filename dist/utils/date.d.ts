declare type DateParam = string | number | Date;
declare class Time {
    date: Date;
    constructor(date?: DateParam);
    format(fmt?: string): string;
    getMonthDays(month: number, year: number): number;
}
export default function date(date: string | number | Date): Time;
export {};
