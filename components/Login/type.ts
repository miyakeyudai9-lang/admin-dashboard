import { z } from "zod";
export interface LoginPayload {
  email: string;
  password: string;
}
export interface LoginViewProps {
  backendErrors?: Record<string, string>;
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
