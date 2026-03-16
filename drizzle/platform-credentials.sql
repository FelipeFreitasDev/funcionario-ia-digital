-- Create platform_credentials table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS platform_credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  access_token LONGTEXT NOT NULL,
  refresh_token LONGTEXT,
  expires_at DATETIME,
  platform_user_id VARCHAR(255) NOT NULL,
  platform_username VARCHAR(255) NOT NULL,
  connected_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_sync_at DATETIME,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_platform_user (user_id, platform),
  INDEX idx_user_id (user_id),
  INDEX idx_platform (platform),
  INDEX idx_expires_at (expires_at)
);

-- Create push_subscriptions table for storing push notification subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  endpoint VARCHAR(500) NOT NULL,
  p256dh VARCHAR(255) NOT NULL,
  auth VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_endpoint (endpoint),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Create push_notification_logs table for tracking sent notifications
CREATE TABLE IF NOT EXISTS push_notification_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body LONGTEXT NOT NULL,
  data JSON,
  status VARCHAR(20) DEFAULT 'sent',
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_sent_at (sent_at)
);
