CREATE TYPE "role" AS ENUM('STUDENT', 'TEACHER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "status" AS ENUM('ACTIVE', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "attendance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"check_in_timestamp" timestamp NOT NULL,
	"status" "status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"course_id" uuid NOT NULL,
	"room_id" text NOT NULL,
	"session_start_time" timestamp NOT NULL,
	"session_end_time" timestamp,
	"status" "status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_enrollments" (
	"student_id" uuid,
	"course_id" uuid,
	CONSTRAINT "course_enrollments_pkey" PRIMARY KEY("student_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"teacher_id" uuid NOT NULL,
	"course_code" text NOT NULL,
	"course_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"building" text NOT NULL,
	"esp32_mac_address" text NOT NULL UNIQUE,
	"totp_secret_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role" "role" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"student_id" text UNIQUE,
	"teacher_id" text UNIQUE,
	"device_id" text
);
--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_session_id_class_sessions_id_fkey" FOREIGN KEY ("session_id") REFERENCES "class_sessions"("id");--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_student_id_users_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id");--> statement-breakpoint
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_room_id_rooms_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id");--> statement-breakpoint
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_student_id_users_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_courses_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id");--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_users_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id");