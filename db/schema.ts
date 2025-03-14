import {pgTable, text, serial, timestamp, uuid} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: uuid('id').primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userInsertSchema = createInsertSchema(users);

export const userSchema = userInsertSchema.pick({
  email: true,
  password: true,
});
