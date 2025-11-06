import { DateTime } from 'luxon';

export function formatDate(date: Date | string): string {
  return DateTime.fromJSDate(typeof date === 'string' ? new Date(date) : date)
    .setLocale('it')
    .toFormat('dd MMM yyyy HH:mm');
}

export function formatDateShort(date: Date | string): string {
  return DateTime.fromJSDate(typeof date === 'string' ? new Date(date) : date)
    .setLocale('it')
    .toFormat('dd MMM yyyy');
}

export function formatTime(date: Date | string): string {
  return DateTime.fromJSDate(typeof date === 'string' ? new Date(date) : date)
    .setLocale('it')
    .toFormat('HH:mm');
}

export function formatDateTime(date: Date | string, format: string = 'dd MMM yyyy HH:mm'): string {
  return DateTime.fromJSDate(typeof date === 'string' ? new Date(date) : date)
    .setLocale('it')
    .toFormat(format);
}
