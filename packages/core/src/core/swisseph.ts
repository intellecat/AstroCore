let engine: any = null;

/**
 * Sets the Swiss Ephemeris engine to be used for calculations.
 * The engine must be initialized before passing it here.
 * @param swe The initialized Swiss Ephemeris instance (Node or Browser)
 */
export function setSwissEphemeris(swe: any) {
    engine = swe;
}

function getEngine() {
    if (!engine) {
        throw new Error('Swiss Ephemeris engine not set. Call setSwissEphemeris(swe) before performing calculations.');
    }
    return engine;
}

export const dateToJulianDay = (date: Date) => getEngine().dateToJulianDay(date);
export const calculatePosition = (jd: number, body: number, flags: number) => getEngine().calculatePosition(jd, body, flags);
export const calculateHouses = (jd: number, lat: number, lng: number, system: any) => getEngine().calculateHouses(jd, lat, lng, system);
export const setSiderealMode = (mode: number, t0: number, ayan_t0: number) => getEngine().setSiderealMode?.(mode, t0, ayan_t0);
export const setTopocentric = (lng: number, lat: number, alt: number) => getEngine().setTopocentric?.(lng, lat, alt);
export const findNextSolarEclipse = (jd: number) => getEngine().findNextSolarEclipse?.(jd);
export const findNextLunarEclipse = (jd: number) => getEngine().findNextLunarEclipse?.(jd);
