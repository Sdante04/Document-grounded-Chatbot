-- infra/sql/099-creacion-demo.sql
USE chatbot;

-- Roles base
INSERT INTO roles (name)
VALUES ('Admin'), ('Editor'), ('Viewer') AS new
ON DUPLICATE KEY UPDATE name = new.name;

-- Planes base (sin VALUES() deprecated)
INSERT INTO plans (name, max_kbs, max_docs, max_messages_per_day)
VALUES
  ('Free', 1, 20, 50),
  ('Pro', 5, 200, 500),
  ('Team', 20, 2000, 5000) AS new
ON DUPLICATE KEY UPDATE
  max_kbs = new.max_kbs,
  max_docs = new.max_docs,
  max_messages_per_day = new.max_messages_per_day;

-- Tenant demo (sin INSERT..SELECT + sin VALUES() deprecated)
INSERT INTO tenants (name, slug, plan_id)
VALUES (
  'Demo',
  'demo',
  (SELECT id FROM plans WHERE name = 'Pro' LIMIT 1)
) AS new
ON DUPLICATE KEY UPDATE
  name = new.name,
  plan_id = new.plan_id;

-- Settings demo (sin INSERT..SELECT + sin VALUES() deprecated)
INSERT INTO tenant_settings (tenant_id, default_language, brand_name, chat_disclaimer)
VALUES (
  (SELECT id FROM tenants WHERE slug = 'demo' LIMIT 1),
  'es',
  'PC Expert Demo',
  'Respuestas basadas en documentos. Si no hay evidencia suficiente, el asistente lo indicará.'
) AS new
ON DUPLICATE KEY UPDATE
  default_language = new.default_language,
  brand_name = new.brand_name,
  chat_disclaimer = new.chat_disclaimer;

-- Usuario admin demo
-- NOTA: Reemplazá el hash por uno real generado con bcrypt en tu backend.
INSERT INTO users (tenant_id, email, password_hash, full_name, is_active)
VALUES (
  (SELECT id FROM tenants WHERE slug = 'demo' LIMIT 1),
  'admin@demo.com',
  '$2b$11$REEMPLAZAR_CON_HASH_BCRYPT_REAL',
  'Admin Demo',
  1
) AS new
ON DUPLICATE KEY UPDATE
  password_hash = new.password_hash,
  full_name = new.full_name,
  is_active = new.is_active;

-- Asignar rol Admin al usuario admin@demo.com (sin INSERT..SELECT + sin VALUES() deprecated)
INSERT INTO user_roles (user_id, role_id)
VALUES (
  (SELECT u.id
   FROM users u
   JOIN tenants t ON t.id = u.tenant_id
   WHERE t.slug = 'demo' AND u.email = 'admin@demo.com'
   LIMIT 1),
  (SELECT r.id FROM roles r WHERE r.name = 'Admin' LIMIT 1)
) AS new
ON DUPLICATE KEY UPDATE
  user_id = new.user_id,
  role_id = new.role_id;

-- KB demo "PC Components Expert"
INSERT INTO knowledge_bases (tenant_id, name, description, openai_vector_store_id, is_default)
VALUES (
  (SELECT id FROM tenants WHERE slug = 'demo' LIMIT 1),
  'PC Components Expert',
  'Bot experto en componentes de PC (demo portfolio).',
  NULL,
  1
) AS new
ON DUPLICATE KEY UPDATE
  description = new.description,
  is_default = new.is_default;

-- Settings KB demo
INSERT INTO kb_settings (kb_id, system_prompt, tone, answer_style, refusal_policy)
VALUES (
  (SELECT kb.id
   FROM knowledge_bases kb
   JOIN tenants t ON t.id = kb.tenant_id
   WHERE t.slug = 'demo' AND kb.name = 'PC Components Expert'
   LIMIT 1),
  'Sos un asistente experto en hardware de PC (CPU, GPU, motherboards, RAM, fuentes, almacenamiento, refrigeración, gabinetes) y armado. Respondé SIEMPRE basado en evidencia de los documentos del cliente. Si la evidencia no alcanza, decilo explícitamente y sugerí qué documento o dato falta. Cuando des recomendaciones, pedí contexto mínimo (presupuesto, país, uso, resolución, componentes actuales) y entregá pasos claros.',
  'tecnico',
  JSON_OBJECT('format','paso_a_paso','verbosity','media','include_checklist',true),
  JSON_OBJECT('no_evidence_behavior','say_not_found','require_citations',true)
) AS new
ON DUPLICATE KEY UPDATE
  system_prompt = new.system_prompt,
  tone = new.tone,
  answer_style = new.answer_style,
  refusal_policy = new.refusal_policy;