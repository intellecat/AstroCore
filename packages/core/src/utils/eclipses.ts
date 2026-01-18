import { 
    findNextSolarEclipse, 
    findNextLunarEclipse,
} from '../core/swisseph.js';
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
            date: DateTime.fromMillis(0).plus({ days: res.maximum - 2440587.5 }).toISO()!, // Rough conversion or use library
            jd: res.maximum,
            isTotal: res.isTotal(),
            isAnnular: res.isAnnular()
        };
    } else {
        const res = findNextLunarEclipse(jd);
        return {
            date: DateTime.fromMillis(0).plus({ days: res.maximum - 2440587.5 }).toISO()!,
            jd: res.maximum,
            isTotal: res.isTotal()
        };
    }
}