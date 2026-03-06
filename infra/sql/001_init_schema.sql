-- infra/sql/001_init_schema.sql
-- Crea la base si no existe (aunque MYSQL_DATABASE ya la crea igual)
CREATE DATABASE IF NOT EXISTS chatbot
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

-- Asegura que el usuario exista para cualquier host
CREATE USER IF NOT EXISTS 'chatbot'@'%' IDENTIFIED BY 'chatbot';

-- Da todos los permisos en la base
GRANT ALL PRIVILEGES ON chatbot.* TO 'chatbot'@'%';

FLUSH PRIVILEGES;