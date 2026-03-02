/**
 * Filter guides: Series (full), Agency/Location (stubs).
 * Drawer is portaled to OverlayRoot; token-only styling; shared zIndex.
 */

export { FilterGuideDrawer, type FilterGuideDrawerProps } from './FilterGuideDrawer';
export type { FilterGuideKind, AgencyGuideEntry, LocationGuideEntry } from './filterGuideTypes';
export {
  SERIES_GUIDE_DATA,
  SERIES_CATEGORIES,
  filterSeriesGuide,
  type SeriesGuideEntry,
} from './seriesGuideData';
