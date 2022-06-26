CREATE TABLE "public.users" (
	"id" varchar(32) NOT NULL,
	"name" varchar(20) NOT NULL,
	"cpf" varchar(11) NOT NULL,
	"birthdate" varchar(10) NOT NULL,
	"email" varchar(60) NOT NULL,
	"password" varchar(8) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.accounts" (
	"id" serial(32) NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"agency" varchar(4) NOT NULL,
	"verify_digit_agency" varchar(1) NOT NULL,
	"account" varchar(8) NOT NULL,
	"verify_digit_account" varchar(1) NOT NULL,
	"balance" double(11,2) NOT NULL,
	CONSTRAINT "accounts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.transactions" (
	"id" varchar(40) NOT NULL,
	"date" varchar(10) NOT NULL,
	"value" double(11,2) NOT NULL,
	"type" varchar(20) NOT NULL,
	"origin_account_id" varchar(40) NOT NULL,
	"destination_account_id" varchar(40) NOT NULL,
	CONSTRAINT "transactions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "accounts" ADD CONSTRAINT "accounts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk0" FOREIGN KEY ("origin_account_id") REFERENCES "accounts"("id");
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fk1" FOREIGN KEY ("destination_account_id") REFERENCES "accounts"("id");
