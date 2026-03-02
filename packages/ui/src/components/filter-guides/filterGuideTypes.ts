/**
 * ============================================================================
 * FILTER GUIDE TYPES — Data shapes for Series, Agency, Location guides
 * ============================================================================
 *
 * Series is fully implemented; Agency and Location are stubbed for future data.
 * Used by FilterGuideDrawer to render the correct title and content per mode.
 */

/**
 * Agency guide entry (stub for future implementation).
 * id: stable id; name: display name; aliases: alternate names; parentAgency: optional parent.
 */
export interface AgencyGuideEntry {
  id: string;
  name: string;
  aliases: string[];
  parentAgency?: string;
}

/**
 * Location guide entry (stub for future implementation).
 * id: stable id; label: "City, ST"; aliases: e.g. DMV/NCR; type: metro | state | remote.
 */
export interface LocationGuideEntry {
  id: string;
  label: string;
  aliases: string[];
  type: 'metro' | 'state' | 'remote';
}

/** Which guide drawer is open: series (full), agency (stub), location (stub). */
export type FilterGuideKind = 'series' | 'agency' | 'location';
