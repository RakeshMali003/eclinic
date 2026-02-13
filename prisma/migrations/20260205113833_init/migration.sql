-- CreateTable
CREATE TABLE "ai_action_logs" (
    "id" SERIAL NOT NULL,
    "module_name" VARCHAR(100),
    "reference_id" VARCHAR(50),
    "action_taken" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_modules" (
    "module_id" SERIAL NOT NULL,
    "module_name" VARCHAR(100),
    "status" VARCHAR(20) DEFAULT 'ACTIVE',
    "description" TEXT,

    CONSTRAINT "ai_modules_pkey" PRIMARY KEY ("module_id")
);

-- CreateTable
CREATE TABLE "ai_predictions" (
    "id" SERIAL NOT NULL,
    "appointment_id" VARCHAR(20),
    "prediction_type" VARCHAR(50),
    "prediction_details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage_stats" (
    "stat_date" DATE NOT NULL,
    "predictions_made" INTEGER,
    "accuracy_percent" INTEGER,
    "hours_saved" INTEGER,
    "cost_savings" DECIMAL(12,2),

    CONSTRAINT "ai_usage_stats_pkey" PRIMARY KEY ("stat_date")
);

-- CreateTable
CREATE TABLE "appointments" (
    "appointment_id" VARCHAR(20) NOT NULL,
    "patient_id" VARCHAR(20),
    "doctor_id" VARCHAR(20),
    "appointment_date" DATE,
    "appointment_time" TIME,
    "type" VARCHAR(50),
    "mode" VARCHAR(20),
    "status" VARCHAR(20),
    "ai_risk_level" VARCHAR(20),
    "consult_duration" INTEGER,
    "earnings" DECIMAL(10,2),

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateTable
CREATE TABLE "patients" (
    "patient_id" VARCHAR(20) NOT NULL,
    "full_name" VARCHAR(100),
    "age" INTEGER,
    "gender" VARCHAR(10),
    "blood_group" VARCHAR(5),
    "abha_id" VARCHAR(25),
    "phone" VARCHAR(20),
    "address" TEXT,
    "medical_history" TEXT,
    "insurance_id" VARCHAR(20),

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" SERIAL NOT NULL,
    "clinic_name" VARCHAR(150) NOT NULL,
    "establishment_year" INTEGER,
    "tagline" VARCHAR(200),
    "description" TEXT,
    "address" TEXT NOT NULL,
    "landmark" VARCHAR(150),
    "pin_code" CHAR(6) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "mobile" CHAR(10) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "website" VARCHAR(200),
    "mobile_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "medical_council_reg_no" VARCHAR(100) NOT NULL,
    "bank_account_name" VARCHAR(150),
    "bank_account_number" VARCHAR(50),
    "ifsc_code" VARCHAR(20),
    "pan_number" CHAR(10),
    "gstin" CHAR(15),
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "declaration_accepted" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "date_of_birth" DATE,
    "profile_photo_url" TEXT,
    "mobile" CHAR(10) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "mobile_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "medical_council_reg_no" VARCHAR(100) NOT NULL,
    "medical_council_name" VARCHAR(150),
    "registration_year" INTEGER,
    "qualifications" TEXT,
    "university_name" VARCHAR(150),
    "graduation_year" INTEGER,
    "experience_years" INTEGER,
    "bio" TEXT,
    "bank_account_name" VARCHAR(150),
    "bank_account_number" VARCHAR(50),
    "ifsc_code" VARCHAR(20),
    "pan_number" CHAR(10),
    "gstin" CHAR(15),
    "terms_accepted" BOOLEAN NOT NULL DEFAULT false,
    "declaration_accepted" BOOLEAN NOT NULL DEFAULT false,
    "verification_status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "invoice_id" VARCHAR(20) NOT NULL,
    "patient_id" VARCHAR(20),
    "invoice_date" DATE,
    "total_amount" DECIMAL(10,2),
    "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" SERIAL NOT NULL,
    "invoice_id" VARCHAR(20),
    "service_name" VARCHAR(100),
    "quantity" INTEGER,
    "rate" DECIMAL(10,2),
    "amount" DECIMAL(10,2),

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_payments" (
    "payment_id" SERIAL NOT NULL,
    "invoice_id" VARCHAR(20),
    "payment_mode" VARCHAR(20),
    "paid_amount" DECIMAL(10,2),
    "payment_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(100),
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "role" VARCHAR(50),
    "password_hash" TEXT,
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50),

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permission_id" SERIAL NOT NULL,
    "permission_name" VARCHAR(100),

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "vitals" (
    "patient_id" VARCHAR(20) NOT NULL,
    "reading_time" TIMESTAMP(3) NOT NULL,
    "bp" VARCHAR(10),
    "heart_rate" INTEGER,
    "temperature" DECIMAL(4,1),
    "weight" DECIMAL(5,2),
    "height" DECIMAL(5,2),
    "bmi" DECIMAL(4,1),

    CONSTRAINT "vitals_pkey" PRIMARY KEY ("patient_id","reading_time")
);
