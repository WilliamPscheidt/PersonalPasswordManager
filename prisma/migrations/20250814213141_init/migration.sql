-- CreateTable
CREATE TABLE "public"."Password" (
    "id" TEXT NOT NULL,
    "masterPass" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);
