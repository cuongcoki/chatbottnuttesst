import { z } from "zod";

export const createBlogSchema = z.object({
  banner_image: z.string().url("Invalid URL").optional(),
  title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title must be at most 100 characters long"),
  content: z.string().min(20, "Content must be at least 20 characters long"),
  status: z.enum(["draft", "published"]).optional(),
});

