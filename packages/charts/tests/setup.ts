import { setSwissEphemeris } from '@astrologer/astro-core';
import * as swe from '@swisseph/node';

// Initialize the engine for all tests
setSwissEphemeris(swe);
