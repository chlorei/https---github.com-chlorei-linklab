import { z } from "zod";
import colorMap from "@/app/utils/colorMap";
import { SHORT_DOMAIN } from "@/app/utils/shortDomain";

export const COLOR_NAMES = Object.keys(colorMap) as (keyof typeof colorMap)[];

function ownHosts(): string[] {
  const hosts = [SHORT_DOMAIN];
  try {
    if (process.env.NEXT_PUBLIC_SITE_URL) hosts.push(new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname);
  } catch {}
  return hosts.map((h) => h.toLowerCase());
}

/** Accepts "example.com/path" by assuming https, like browsers do. */
export function normalizeUrl(value: string): string {
  const v = value.trim();
  // "example.com:8080" must not be mistaken for a scheme, so only `scheme://` and
  // known non-hierarchical schemes (which are then rejected) are left untouched
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(v) || /^(javascript|data|vbscript|mailto|file|blob):/i.test(v)) return v;
  return `https://${v}`;
}

const httpUrl = z
  .string()
  .trim()
  .min(1, "URL is required")
  .max(2048, "URL is too long")
  .transform(normalizeUrl)
  // one check: zod v4 keeps running later refinements after an earlier one fails
  .superRefine((value, ctx) => {
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      ctx.addIssue({ code: "custom", message: "Please enter a valid http(s) URL" });
      return;
    }
    if ((url.protocol !== "http:" && url.protocol !== "https:") || !url.hostname.includes(".")) {
      ctx.addIssue({ code: "custom", message: "Please enter a valid http(s) URL" });
    } else if (ownHosts().includes(url.hostname.toLowerCase())) {
      ctx.addIssue({ code: "custom", message: "This URL is already a short link" });
    }
  });

const objectIdString = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const createLinkSchema = z.object({
  originalUrl: httpUrl,
  projectId: objectIdString.nullish().or(z.literal("").transform(() => null)),
});

export const projectFieldsSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().max(1000).optional().default(""),
  color: z.enum(COLOR_NAMES as [string, ...string[]]).optional().default("mint"),
});

export const projectPatchSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100).optional(),
  description: z.string().trim().max(1000).optional(),
  color: z.enum(COLOR_NAMES as [string, ...string[]]).optional(),
});

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

const password = z.string().min(8, "Password must be at least 8 characters").max(128);

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  currentPassword: z.string().max(128).optional(),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password").max(128),
    newPassword: password,
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must differ from the current one",
    path: ["newPassword"],
  });

export const idListSchema = z.array(objectIdString).max(500);
