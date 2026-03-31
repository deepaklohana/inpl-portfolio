-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "showOnPages" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "product_testimonials" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "testimonialId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_testimonials_productId_testimonialId_key" ON "product_testimonials"("productId", "testimonialId");

-- AddForeignKey
ALTER TABLE "product_testimonials" ADD CONSTRAINT "product_testimonials_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_testimonials" ADD CONSTRAINT "product_testimonials_testimonialId_fkey" FOREIGN KEY ("testimonialId") REFERENCES "testimonials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
