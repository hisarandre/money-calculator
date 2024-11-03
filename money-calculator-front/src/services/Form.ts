import { z } from "zod";

const accountSchema = z.object({
    label: z.string().min(1, { message: "Label is required" }),
    fee: z.number({ required_error: "Fee is required" }),
});

export { accountSchema };