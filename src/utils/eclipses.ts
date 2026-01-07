import { 
    findNextSolarEclipse, 
    findNextLunarEclipse,
    dateToJulianDay
} from '@swisseph/node';
import { getJulianDay } from './time.js';
import { DateTime } from 'luxon';

export interface EclipseResult {
    date: string;
    jd: number;
    isTotal: boolean;
    isAnnular?: boolean;
}

export async function findNextEclipse(
    startDate: Date | string | DateTime,
    type: 'solar' | 'lunar'
): Promise<EclipseResult> {
    const jd = getJulianDay(startDate);
    
    if (type === 'solar') {
        const res = findNextSolarEclipse(jd);
        return {
            date: DateTime.fromMillis(0).plus({ days: res.jd - 2440587.5 }).toISO()!, // Rough conversion or use library
            jd: res.jd,
            isTotal: res.isTotal,
            isAnnular: res.isAnnular
        };
    } else {
        const res = findNextLunarEclipse(jd);
        return {
            date: DateTime.fromMillis(0).plus({ days: res.jd - 2440587.5 }).toISO()!,
            jd: res.jd,
            isTotal: res.isTotal
        };
    }
}
