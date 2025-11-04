-- Create enums
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- Modify User table
ALTER TABLE "User" 
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER',
  ADD COLUMN "deletedAt" TIMESTAMP,
  ADD COLUMN "deletedBy" TEXT REFERENCES "User"(id);

-- Create temporary function to get first user id
CREATE OR REPLACE FUNCTION get_first_user_id() RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT id FROM "User" LIMIT 1);
END;
$$ LANGUAGE plpgsql;

-- Update Team table
ALTER TABLE "Team" 
  ADD COLUMN "description" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- Add managedBy column after getting first user
ALTER TABLE "Team" 
  ADD COLUMN "managedBy" TEXT;
UPDATE "Team" SET "managedBy" = get_first_user_id();
ALTER TABLE "Team" 
  ALTER COLUMN "managedBy" SET NOT NULL,
  ADD FOREIGN KEY ("managedBy") REFERENCES "User"(id);

-- Update TeamMember table
ALTER TABLE "TeamMember" 
  ADD COLUMN "role" TEXT NOT NULL DEFAULT 'MEMBER',
  ADD COLUMN "joinedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD CONSTRAINT "TeamMember_userId_teamId_key" UNIQUE ("userId", "teamId");

-- Update Task table first with new columns
ALTER TABLE "Task"
  ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "dueDate" TIMESTAMP,
  ADD COLUMN "completedAt" TIMESTAMP;

-- Handle status column separately
ALTER TABLE "Task" ADD COLUMN "new_status" "TaskStatus";
UPDATE "Task" SET "new_status" = CASE 
  WHEN status = 'todo' THEN 'TODO'::"TaskStatus"
  WHEN status = 'in-progress' THEN 'IN_PROGRESS'::"TaskStatus"
  WHEN status = 'completed' THEN 'COMPLETED'::"TaskStatus"
  ELSE 'TODO'::"TaskStatus"
END;
ALTER TABLE "Task" DROP COLUMN "status";
ALTER TABLE "Task" RENAME COLUMN "new_status" TO "status";
ALTER TABLE "Task" ALTER COLUMN "status" SET NOT NULL,
                   ALTER COLUMN "status" SET DEFAULT 'TODO'::"TaskStatus";

-- Add createdBy to Task
ALTER TABLE "Task" 
  ADD COLUMN "createdBy" TEXT;
UPDATE "Task" SET "createdBy" = get_first_user_id();
ALTER TABLE "Task" 
  ALTER COLUMN "createdBy" SET NOT NULL,
  ADD FOREIGN KEY ("createdBy") REFERENCES "User"(id);

-- Create ActivityLog table
CREATE TABLE "ActivityLog" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "details" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- Drop the temporary function
DROP FUNCTION get_first_user_id();