-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_image" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "role" TEXT NOT NULL DEFAULT 'USER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "cover_image" TEXT,
    "trip_type" TEXT NOT NULL,
    "travel_style" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "share_token" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "cost_index" INTEGER NOT NULL,
    "popularity" REAL NOT NULL DEFAULT 0.0,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "trip_stops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "sequence" INTEGER NOT NULL,
    CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "trip_stops_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "city_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "estimated_cost" REAL NOT NULL,
    "image" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    CONSTRAINT "activities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trip_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_stop_id" TEXT NOT NULL,
    "activity_id" TEXT,
    "custom_name" TEXT,
    "custom_cost" REAL,
    "date" DATETIME NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "trip_activities_trip_stop_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "trip_activities_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "expenses_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "saved_destinations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,
    CONSTRAINT "saved_destinations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "saved_destinations_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "packing_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_packed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "packing_items_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trip_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'VIEWER',
    CONSTRAINT "trip_members_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "trip_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "trips_share_token_key" ON "trips"("share_token");

-- CreateIndex
CREATE UNIQUE INDEX "saved_destinations_user_id_city_id_key" ON "saved_destinations"("user_id", "city_id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_members_trip_id_user_id_key" ON "trip_members"("trip_id", "user_id");
