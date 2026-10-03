import type { ZodType } from "zod"

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string>; firstMessage: string }

export function validateForm<T>(schema: ZodType<T>, input: unknown): ValidationResult<T> {
  const result = schema.safeParse(input)
  if (result.success) return { success: true, data: result.data }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0])
    if (!errors[key]) errors[key] = issue.message
  }
  return { success: false, errors, firstMessage: result.error.issues[0].message }
}