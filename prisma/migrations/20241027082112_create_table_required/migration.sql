-- CreateTable
CREATE TABLE "mst_user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trx_project_technology" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "technology_id" TEXT NOT NULL,

    CONSTRAINT "trx_project_technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_project_image" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mst_project_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectTechnology" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "mst_user_username_key" ON "mst_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectTechnology_AB_unique" ON "_ProjectTechnology"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectTechnology_B_index" ON "_ProjectTechnology"("B");

-- AddForeignKey
ALTER TABLE "trx_project_technology" ADD CONSTRAINT "trx_project_technology_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "mst_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trx_project_technology" ADD CONSTRAINT "trx_project_technology_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "mst_technology"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_project_image" ADD CONSTRAINT "mst_project_image_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "mst_project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTechnology" ADD CONSTRAINT "_ProjectTechnology_A_fkey" FOREIGN KEY ("A") REFERENCES "mst_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTechnology" ADD CONSTRAINT "_ProjectTechnology_B_fkey" FOREIGN KEY ("B") REFERENCES "mst_technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
