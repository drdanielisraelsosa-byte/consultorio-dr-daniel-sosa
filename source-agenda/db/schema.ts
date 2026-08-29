import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const appointments = sqliteTable(
  "appointments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    publicId: text("public_id").notNull(),
    appointmentDate: text("appointment_date").notNull(),
    appointmentTime: text("appointment_time").notNull(),
    patientName: text("patient_name").notNull(),
    age: integer("age").notNull(),
    sex: text("sex"),
    reason: text("reason").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    status: text("status").notNull().default("confirmed"),
    privacyAcceptedAt: text("privacy_accepted_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("appointments_slot_unique").on(table.appointmentDate, table.appointmentTime),
    uniqueIndex("appointments_public_id_unique").on(table.publicId),
  ],
);
