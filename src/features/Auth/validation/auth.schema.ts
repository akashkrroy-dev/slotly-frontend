import { z } from "zod"

export const emailSchema = z
  .string()
  .trim()
  .max(254, "Email is too long")
  .email("Enter a valid email")

/** 8-64 chars, and at least 2 of: a letter, a number, a special character. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters")
  .superRefine((value, ctx) => {
    const met = [
      /[A-Za-z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9\s]/.test(value),
    ].filter(Boolean).length

    if (met < 2) {
      ctx.addIssue({
        code: "custom",
        message: "Use at least 2 of: a letter, a number, a special character",
      })
    }
  })