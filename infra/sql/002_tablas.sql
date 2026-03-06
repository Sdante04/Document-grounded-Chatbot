-- infra/sql/002-tablas.sql
USE chatbot;

-- =========================
-- 1) Planes / Suscripciones
-- =========================
CREATE TABLE IF NOT EXISTS plans (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name                  VARCHAR(64)      NOT NULL,
  max_kbs               INT UNSIGNED     NOT NULL DEFAULT 1,
  max_docs              INT UNSIGNED     NOT NULL DEFAULT 20,
  max_messages_per_day  INT UNSIGNED     NOT NULL DEFAULT 50,
  created_at            TIMESTAMP(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_plans_name (name),
  CONSTRAINT chk_plans_limits
    CHECK (max_kbs >= 1 AND max_docs >= 0 AND max_messages_per_day >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS tenants (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(128)     NOT NULL,
  slug          VARCHAR(128)     NOT NULL,
  plan_id       BIGINT UNSIGNED  NULL,
  created_at    TIMESTAMP(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_tenants_slug (slug),
  CONSTRAINT fk_tenants_plan
    FOREIGN KEY (plan_id) REFERENCES plans(id)
    ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS subscriptions (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id             BIGINT UNSIGNED NOT NULL,
  plan_id               BIGINT UNSIGNED NOT NULL,
  status                ENUM('active','past_due','canceled') NOT NULL DEFAULT 'active',
  current_period_start  DATETIME(6)     NULL,
  current_period_end    DATETIME(6)     NULL,
  created_at            TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at            TIMESTAMP(6)             NULL ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_subscriptions_tenant (tenant_id),
  CONSTRAINT fk_subscriptions_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_subscriptions_plan
    FOREIGN KEY (plan_id) REFERENCES plans(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================
-- 2) Usuarios / Roles
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id      BIGINT UNSIGNED NOT NULL,
  email          VARCHAR(254)    NOT NULL,
  password_hash  VARCHAR(255)    NOT NULL,
  full_name      VARCHAR(160)            NULL,
  is_active      TINYINT UNSIGNED NOT NULL DEFAULT 1,
  created_at     TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at     TIMESTAMP(6)             NULL ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_tenant_email (tenant_id, email),
  CONSTRAINT fk_users_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT chk_users_is_active
    CHECK (is_active IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS roles (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(32)     NOT NULL,
  created_at  TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS user_roles (
  user_id  BIGINT UNSIGNED NOT NULL,
  role_id  BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_user_roles_role
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================
-- 3) Personalización / KB
-- =========================
CREATE TABLE IF NOT EXISTS tenant_settings (
  tenant_id         BIGINT UNSIGNED NOT NULL,
  default_language  VARCHAR(16)     NOT NULL DEFAULT 'es',
  brand_name        VARCHAR(128)             NULL,
  chat_disclaimer   TEXT                     NULL,
  created_at        TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at        TIMESTAMP(6)             NULL ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (tenant_id),
  CONSTRAINT fk_tenant_settings_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS knowledge_bases (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id              BIGINT UNSIGNED NOT NULL,
  name                   VARCHAR(128)    NOT NULL,
  description            TEXT                     NULL,
  openai_vector_store_id VARCHAR(128)            NULL,
  is_default             TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at             TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at             TIMESTAMP(6)             NULL ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_kb_tenant_name (tenant_id, name),
  UNIQUE KEY uq_kb_openai_vector_store_id (openai_vector_store_id),
  CONSTRAINT fk_kb_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT chk_kb_is_default
    CHECK (is_default IN (0,1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS kb_settings (
  kb_id          BIGINT UNSIGNED NOT NULL,
  system_prompt  LONGTEXT        NULL,
  tone           VARCHAR(32)     NULL,
  answer_style   JSON            NULL,
  refusal_policy JSON            NULL,
  created_at     TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at     TIMESTAMP(6)             NULL ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (kb_id),
  CONSTRAINT fk_kb_settings_kb
    FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================
-- 4) Documentos
-- =========================
CREATE TABLE IF NOT EXISTS documents (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id          BIGINT UNSIGNED NOT NULL,
  kb_id              BIGINT UNSIGNED NOT NULL,
  original_filename  VARCHAR(255)    NOT NULL,
  mime_type          VARCHAR(128)    NOT NULL,
  storage_url        TEXT            NOT NULL,
  openai_file_id     VARCHAR(128)             NULL,
  status             ENUM('Uploaded','Indexing','Ready','Failed','Deleted') NOT NULL DEFAULT 'Uploaded',
  error_message      TEXT                     NULL,
  created_by_user_id BIGINT UNSIGNED NOT NULL,
  created_at         TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at         TIMESTAMP(6)             NULL ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  CONSTRAINT fk_documents_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_documents_kb
    FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_documents_created_by
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS document_tags (
  document_id  BIGINT UNSIGNED NOT NULL,
  tag          VARCHAR(64)     NOT NULL,
  PRIMARY KEY (document_id, tag),
  CONSTRAINT fk_document_tags_document
    FOREIGN KEY (document_id) REFERENCES documents(id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================
-- 5) Chat / Mensajes / Citas
-- =========================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id   BIGINT UNSIGNED NOT NULL,
  kb_id       BIGINT UNSIGNED NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(160)             NULL,
  created_at  TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  TIMESTAMP(6)             NULL ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  CONSTRAINT fk_chat_sessions_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_chat_sessions_kb
    FOREIGN KEY (kb_id) REFERENCES knowledge_bases(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_chat_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chat_session_id    BIGINT UNSIGNED NOT NULL,
  role               ENUM('user','assistant','system') NOT NULL,
  content            LONGTEXT        NOT NULL,
  openai_response_id VARCHAR(128)             NULL,
  tokens_in          INT UNSIGNED             NULL,
  tokens_out         INT UNSIGNED             NULL,
  created_at         TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  CONSTRAINT fk_chat_messages_session
    FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT chk_chat_tokens
    CHECK (
      (tokens_in IS NULL OR tokens_in >= 0) AND
      (tokens_out IS NULL OR tokens_out >= 0)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS message_citations (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chat_message_id  BIGINT UNSIGNED NOT NULL,
  document_id      BIGINT UNSIGNED          NULL,
  openai_file_id   VARCHAR(128)    NOT NULL,
  quote            TEXT            NOT NULL,
  source_label     VARCHAR(255)             NULL,
  locator          VARCHAR(64)              NULL,
  created_at       TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  CONSTRAINT fk_message_citations_message
    FOREIGN KEY (chat_message_id) REFERENCES chat_messages(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_message_citations_document
    FOREIGN KEY (document_id) REFERENCES documents(id)
    ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =========================
-- 6) Uso / Costos
-- =========================
CREATE TABLE IF NOT EXISTS usage_events (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id    BIGINT UNSIGNED NOT NULL,
  user_id      BIGINT UNSIGNED          NULL,
  type         ENUM('chat','ingestion') NOT NULL,
  openai_model VARCHAR(64)              NULL,
  tokens_in    INT UNSIGNED             NULL,
  tokens_out   INT UNSIGNED             NULL,
  cost_usd     DECIMAL(12,6)            NULL,
  created_at   TIMESTAMP(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  CONSTRAINT fk_usage_events_tenant
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_usage_events_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT chk_usage_tokens_cost
    CHECK (
      (tokens_in IS NULL OR tokens_in >= 0) AND
      (tokens_out IS NULL OR tokens_out >= 0) AND
      (cost_usd IS NULL OR cost_usd >= 0)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;