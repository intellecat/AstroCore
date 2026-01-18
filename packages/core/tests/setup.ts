import { setSwissEphemeris } from '../src/core/swisseph.js';
import * as swe from '@swisseph/node';

// Initialize the engine for all tests
setSwissEphemeris(swe);

// ... existing setup if any ...