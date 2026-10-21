/**
 * Clickable table rows: the row's primary link stretches over the whole row.
 * Other links in the row need `relative z-10` to stay clickable on top of it.
 */
export const clickableRow =
  "relative cursor-pointer hover:bg-accent/40 focus-within:bg-accent/40";

export const rowLink =
  "font-medium underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none after:absolute after:inset-0 after:content-['']";

export const rowInnerLink = "relative z-10 underline-offset-4 hover:underline";
