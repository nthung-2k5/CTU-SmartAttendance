ALTER TABLE "attendance_records" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "attendance_records" ALTER COLUMN "check_in_timestamp" SET DATA TYPE timestamp with time zone USING "check_in_timestamp"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "class_sessions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "class_sessions" ALTER COLUMN "session_start_time" SET DATA TYPE timestamp with time zone USING "session_start_time"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "class_sessions" ALTER COLUMN "session_end_time" SET DATA TYPE timestamp with time zone USING "session_end_time"::timestamp with time zone;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;