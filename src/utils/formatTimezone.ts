export function formatTimezone(date: Date): Date {
    const newDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    
    return newDate;
}
