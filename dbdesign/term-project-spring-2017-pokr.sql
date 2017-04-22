CREATE TABLE "Cards" (
    id integer NOT NULL,
    name character varying(20) NOT NULL,
    value character varying(10) NOT NULL,
    suit character varying(10) NOT NULL,
    "spriteX" character varying(10) NOT NULL,
    "spriteY" character varying(10) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


CREATE TABLE "Chats" (
    id integer NOT NULL,
    "user" integer,
    message text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


CREATE TABLE "Chips" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    value integer NOT NULL,
    "spriteX" character varying(10) NOT NULL,
    "spriteY" character varying(10) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


CREATE TABLE "GameCards" (
    id integer NOT NULL,
    game integer,
    card integer,
    type integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "GamePots" (
    id integer NOT NULL,
    game integer,
    value integer DEFAULT 0 NOT NULL,
    winner integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


CREATE TABLE "GameUsers" (
    id integer NOT NULL,
    game integer,
    "user" integer,
    status integer DEFAULT 1,
    "isBigBlind" boolean DEFAULT false,
    "isSmallBlind" boolean DEFAULT false,
    "isDealer" boolean DEFAULT false,
    "isCurrent" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


CREATE TABLE "Games" (
    id integer NOT NULL,
    "table" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


CREATE TABLE "Passwords" (
    id integer NOT NULL,
    "user" integer,
    link character varying(100) NOT NULL,
    "oldPassword" character varying(100),
    "newPassword" character varying(100),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "PotUsers" (
    id integer NOT NULL,
    pot integer,
    "user" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "Rewards" (
    id integer NOT NULL,
    "user" integer,
    value integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "Sessions" (
    id integer NOT NULL,
    "user" integer,
    "jwtCode" character varying(100) NOT NULL,
    expiry timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "TableUsers" (
    id integer NOT NULL,
    "table" integer,
    "user" integer,
    status integer DEFAULT 0 NOT NULL,
    "buyIn" integer DEFAULT 0 NOT NULL,
    "currentChips" integer DEFAULT 0 NOT NULL,
    "position" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "Tables" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    "bigBlind" integer NOT NULL,
    "smallBlind" integer NOT NULL,
    status integer DEFAULT 0 NOT NULL,
    socket character varying(100) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "UserCards" (
    id integer NOT NULL,
    "user" integer,
    card integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "UserChips" (
    id integer NOT NULL,
    "user" integer,
    value integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "UserPlays" (
    id integer NOT NULL,
    "user" integer,
    "playType" integer DEFAULT 1 NOT NULL,
    "betAmount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE "Users" (
    id integer NOT NULL,
    username character varying(50),
    name character varying(50),
    email character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    avatar character varying(100),
    "verificationCode" character varying(100) NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);