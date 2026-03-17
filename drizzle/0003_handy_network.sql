CREATE TABLE `subscriptions` (
	`id` varchar(100) NOT NULL,
	`userId` int NOT NULL,
	`stripeSubscriptionId` varchar(255),
	`planId` varchar(50) NOT NULL,
	`status` enum('active','canceled','past_due','unpaid') NOT NULL DEFAULT 'active',
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'BRL',
	`billingCycle` enum('monthly','annual') NOT NULL DEFAULT 'monthly',
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`canceledAt` timestamp,
	`cancelReason` text,
	`nextBillingDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('inactive','active','canceled','past_due') DEFAULT 'inactive' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentPlanId` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStartDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionEndDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `lastPaymentDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `nextBillingDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_stripeCustomerId_unique` UNIQUE(`stripeCustomerId`);