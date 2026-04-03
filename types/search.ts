// types/search.ts
// The typed version of what's in the URL when the user searches or filters.
// We store filter state in the URL (not in React state) so the page can be
// refreshed or shared and still show the same results.

// What gets read from the URL and passed into the data fetcher.
// All raw URL params are strings — these are the cleaned-up, typed versions.
export interface FilterState {
  search: string; // what the user typed in the search box; empty = no filter
  type: string;   // selected type like "fire"; empty = all types
  page: number;   // current page number, always 1 or higher
  limit: number;  // how many items to show per page (10, 20, 50, or 100)
}
