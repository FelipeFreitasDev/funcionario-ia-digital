-- Create webhooks table for storing webhook events
CREATE TABLE IF NOT EXISTS webhooks (
  id VARCHAR(50) PRIMARY KEY,
  userId INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  eventType VARCHAR(100) NOT NULL,
  payload JSON NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  retryCount INT DEFAULT 0,
  maxRetries INT DEFAULT 3,
  nextRetryAt TIMESTAMP NULL,
  processedAt TIMESTAMP NULL,
  error TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_platform (platform),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);

-- Create scheduled_posts table for scheduling publications
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id VARCHAR(50) PRIMARY KEY,
  userId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  platforms JSON NOT NULL,
  scheduledAt TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  publishedAt TIMESTAMP NULL,
  error TEXT NULL,
  metadata JSON NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_scheduledAt (scheduledAt),
  INDEX idx_createdAt (createdAt)
);

-- Create analytics table for storing metrics
CREATE TABLE IF NOT EXISTS analytics (
  id VARCHAR(50) PRIMARY KEY,
  userId INT NOT NULL,
  date DATE NOT NULL,
  platform VARCHAR(50) NOT NULL,
  metric VARCHAR(100) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  metadata JSON NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_userId (userId),
  INDEX idx_date (date),
  INDEX idx_platform (platform),
  INDEX idx_metric (metric),
  UNIQUE KEY unique_metric (userId, date, platform, metric)
);

-- Create webhook_logs table for tracking webhook processing
CREATE TABLE IF NOT EXISTS webhook_logs (
  id VARCHAR(50) PRIMARY KEY,
  webhookId VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  statusCode INT NULL,
  response TEXT NULL,
  processingTime INT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_webhookId (webhookId),
  INDEX idx_status (status),
  FOREIGN KEY (webhookId) REFERENCES webhooks(id) ON DELETE CASCADE
);
