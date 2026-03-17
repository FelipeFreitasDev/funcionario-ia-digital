DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `users` DROP INDEX `users_stripeCustomerId_unique`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `stripeCustomerId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `subscriptionStatus`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `currentPlanId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `subscriptionStartDate`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `subscriptionEndDate`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `lastPaymentDate`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `nextBillingDate`;