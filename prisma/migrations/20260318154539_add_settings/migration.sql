-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "classFee2028" INTEGER NOT NULL,
    "classFee2027" INTEGER NOT NULL,
    "courierFee" INTEGER NOT NULL,
    "bankDetails" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
