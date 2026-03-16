-- Create client integrations credentials table
CREATE TABLE IF NOT EXISTS client_integrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  stripe_secret_key VARCHAR(255),
  stripe_publishable_key VARCHAR(255),
  sendgrid_api_key VARCHAR(255),
  email_from VARCHAR(255),
  smtp_host VARCHAR(255),
  smtp_port INT,
  smtp_username VARCHAR(255),
  smtp_password VARCHAR(255),
  integrations_enabled JSON DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (token),
  INDEX (user_id)
);
