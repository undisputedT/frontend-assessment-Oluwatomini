// lib/utils/extractIdFromUrl.ts
// The PokéAPI doesn't give us IDs directly in list responses — it gives us URLs.
// This function pulls the number out of the end of a URL so we don't have to
// make an extra network request just to get an ID.
//
// Example: "https://pokeapi.co/api/v2/pokemon/42/" → 42

export function extractIdFromUrl(url: string): number {
  // Grab the last number in the URL, ignoring any trailing slash
  const match = url.match(/\/(\d+)\/?$/);
  if (!match) throw new Error(`Could not extract ID from URL: ${url}`);
  return parseInt(match[1], 10);
}
