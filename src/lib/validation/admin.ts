import { z } from "zod";

export const suspendSchema = z.object({ isSuspended: z.boolean() });
