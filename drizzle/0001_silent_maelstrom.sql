CREATE TABLE `purchases` (
	`id` varchar(100) NOT NULL,
	`transactionId` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`status` enum('pending','approved','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`kiwifyOrderId` varchar(255),
	`downloadToken` varchar(255),
	`downloadCount` int NOT NULL DEFAULT 0,
	`lastDownloadAt` timestamp NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp NULL,
	CONSTRAINT `purchases_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchases_transactionId_unique` UNIQUE(`transactionId`),
	CONSTRAINT `purchases_downloadToken_unique` UNIQUE(`downloadToken`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`category` enum('installation','performance','compatibility','features','offline','other') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`description` longtext NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
	`attachments` json DEFAULT (json_array()),
	`responses` json DEFAULT (json_array()),
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
