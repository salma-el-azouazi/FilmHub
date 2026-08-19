USE filmhub;

DELIMITER //
CREATE PROCEDURE add_column_if_missing(IN table_name_in VARCHAR(64), IN column_name_in VARCHAR(64), IN column_definition_in TEXT)
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = table_name_in AND COLUMN_NAME = column_name_in
  ) THEN
    SET @ddl = CONCAT('ALTER TABLE ', table_name_in, ' ADD COLUMN ', column_name_in, ' ', column_definition_in);
    PREPARE stmt FROM @ddl;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END//
DELIMITER ;

ALTER TABLE users MODIFY status ENUM('active','suspended','disabled','posting_blocked') NOT NULL DEFAULT 'active';
CALL add_column_if_missing('users', 'updated_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
CALL add_column_if_missing('categories', 'icon', 'VARCHAR(80) NOT NULL DEFAULT ''Film''');
CALL add_column_if_missing('posts', 'block_moderator_id', 'INT NULL');
CALL add_column_if_missing('posts', 'blocked_at', 'DATETIME NULL');
CALL add_column_if_missing('comments', 'likes_count', 'INT NOT NULL DEFAULT 0');
CALL add_column_if_missing('comments', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP');
CALL add_column_if_missing('comments', 'deleted_at', 'DATETIME NULL');
CALL add_column_if_missing('notifications', 'link', 'VARCHAR(255) NULL');

CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(180) NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_password_resets_email (email),
  INDEX idx_password_resets_expires (expires_at)
);

CREATE TABLE IF NOT EXISTS remember_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,
  csrf_token_hash CHAR(64) NOT NULL,
  user_agent VARCHAR(255),
  ip_address VARCHAR(80),
  expires_at DATETIME NOT NULL,
  last_used_at DATETIME,
  revoked_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_remember_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_remember_tokens_user (user_id),
  INDEX idx_remember_tokens_expires (expires_at)
);

CREATE TABLE IF NOT EXISTS post_categories (
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, category_id),
  CONSTRAINT fk_post_categories_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  tag VARCHAR(80) NOT NULL,
  slug VARCHAR(90) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_post_tag (post_id, slug),
  INDEX idx_post_tags_slug (slug),
  CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_views (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT,
  viewer_hash VARCHAR(80),
  ip_address VARCHAR(80),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_post_views_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_views_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_post_views_post (post_id)
);

CREATE TABLE IF NOT EXISTS post_likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_post_like (user_id, post_id),
  CONSTRAINT fk_post_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_likes_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS movie_views (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  movie_key VARCHAR(240) NOT NULL,
  user_id INT,
  viewer_hash VARCHAR(80),
  ip_address VARCHAR(80),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_movie_views_key (movie_key)
);

CREATE TABLE IF NOT EXISTS movie_likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  movie_key VARCHAR(240) NOT NULL,
  actor_hash VARCHAR(80) NOT NULL,
  user_id INT,
  ip_address VARCHAR(80),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_movie_like (movie_key, actor_hash)
);

CREATE TABLE IF NOT EXISTS movie_dislikes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  movie_key VARCHAR(240) NOT NULL,
  actor_hash VARCHAR(80) NOT NULL,
  user_id INT,
  ip_address VARCHAR(80),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_movie_dislike (movie_key, actor_hash)
);

CREATE TABLE IF NOT EXISTS comment_replies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  reply_comment_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_comment_reply (reply_comment_id),
  CONSTRAINT fk_comment_replies_parent FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_replies_reply FOREIGN KEY (reply_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_likes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_comment_like (comment_id, user_id),
  CONSTRAINT fk_comment_likes_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_likes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,
  subject VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(80),
  user_agent VARCHAR(255),
  status ENUM('new','read','replied','archived') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS moderation_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  moderator_id INT,
  target_type ENUM('post','user','comment','category') NOT NULL,
  target_id INT NOT NULL,
  action VARCHAR(80) NOT NULL,
  reason VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_moderation_logs_moderator FOREIGN KEY (moderator_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT IGNORE INTO post_categories (post_id, category_id)
SELECT id, category_id FROM posts WHERE category_id IS NOT NULL;

INSERT IGNORE INTO post_likes (user_id, post_id)
SELECT user_id, post_id FROM likes;

INSERT IGNORE INTO comment_replies (comment_id, reply_comment_id)
SELECT parent_comment_id, id FROM comments WHERE parent_comment_id IS NOT NULL;

DROP PROCEDURE add_column_if_missing;
