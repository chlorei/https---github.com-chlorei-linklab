/** Public host that serves short links, e.g. "rld.bio". */
export const SHORT_DOMAIN = process.env.NEXT_PUBLIC_SHORT_DOMAIN || "rld.bio";

export function shortLinkUrl(shortId: string) {
  return `https://${SHORT_DOMAIN}/${shortId}`;
}
