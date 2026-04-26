-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'voice',
    "language" TEXT NOT NULL DEFAULT 'en',
    "userName" TEXT,
    "userPhone" TEXT,
    "issueType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "summary" TEXT
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KnowledgeDoc" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "source" TEXT,
    "content" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL DEFAULT '[]',
    "qdrantId" TEXT
);

-- CreateTable
CREATE TABLE "VoiceSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "provider" TEXT NOT NULL DEFAULT 'vapi',
    "assistantId" TEXT,
    "callId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "notes" TEXT
);
