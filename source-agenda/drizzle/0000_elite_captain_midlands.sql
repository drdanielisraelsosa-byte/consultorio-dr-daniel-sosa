CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_id` text NOT NULL,
	`appointment_date` text NOT NULL,
	`appointment_time` text NOT NULL,
	`patient_name` text NOT NULL,
	`age` integer NOT NULL,
	`sex` text,
	`reason` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`privacy_accepted_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `appointments_slot_unique` ON `appointments` (`appointment_date`,`appointment_time`);--> statement-breakpoint
CREATE UNIQUE INDEX `appointments_public_id_unique` ON `appointments` (`public_id`);