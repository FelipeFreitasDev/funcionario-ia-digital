-- Favorites table for storing user's favorite generations
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` varchar(100) NOT NULL,
  `userId` int NOT NULL,
  `generationId` varchar(100) NOT NULL,
  `collectionName` varchar(255),
  `isPublic` tinyint(1) NOT NULL DEFAULT 0,
  `publicToken` varchar(255) UNIQUE,
  `expiresAt` timestamp NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId_idx` (`userId`),
  KEY `generationId_idx` (`generationId`),
  KEY `publicToken_idx` (`publicToken`),
  UNIQUE KEY `user_generation_idx` (`userId`, `generationId`)
);
