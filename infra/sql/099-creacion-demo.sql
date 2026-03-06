-- infra/sql/099-creacion-demo.sql
USE chatbot;

-- Roles base
INSERT INTO roles (name)
VALUES ('Admin'), ('Editor'), ('Viewer')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Planes base
INSERT INTO plans (name, max_kbs, max_docs, max_messages_per_day)
VALUES
  ('Free', 1, 20, 50),
  ('Pro', 5, 200, 500),
  ('Team', 20, 2000, 5000)
ON DUPLICATE KEY UPDATE
  max_kbs = VALUES(max_kbs),
  max_docs = VALUES(max_docs),
  max_messages_per_day = VALUES(max_messages_per_day);

-- Tenant demo
INSERT INTO tenants (name, slug, plan_id)
SELECT 'Demo', 'demo', p.id
FROM plans p
WHERE p.name = 'Pro'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  plan_id = VALUES(plan_id);

-- Settings demo (opcional)
INSERT INTO tenant_settings (tenant_id, default_language, brand_name, chat_disclaimer)
SELECT t.id, 'es', 'PC Expert Demo', 'Respuestas basadas en documentos. Si no hay evidencia suficiente, el asistente lo indicará.'
FROM tenants t
WHERE t.slug = 'demo'
ON DUPLICATE KEY UPDATE
  default_language = VALUES(default_language),
  brand_name = VALUES(brand_name),
  chat_disclaimer = VALUES(chat_disclaimer);

-- Usuario admin demo
-- NOTA: Reemplazá el hash por uno real generado con bcrypt en tu backend.
-- Ejemplo: $2b$11$... (bcrypt)
INSERT INTO users (tenant_id, email, password_hash, full_name, is_active)
SELECT t.id, 'admin@demo.com', '$2b$11$REEMPLAZAR_CON_HASH_BCRYPT_REAL', 'Admin Demo', 1
FROM tenants t
WHERE t.slug = 'demo'
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  is_active = VALUES(is_active);

-- Asignar rol Admin al usuario admin@demo.com
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN tenants t ON t.id = u.tenant_id
JOIN roles r ON r.name = 'Admin'
WHERE t.slug = 'demo' AND u.email = 'admin@demo.com'
ON DUPLICATE KEY UPDATE user_id = user_id;

-- KB demo "PC Components Expert"
INSERT INTO knowledge_bases (tenant_id, name, description, openai_vector_store_id, is_default)
SELECT t.id, 'PC Components Expert', 'Bot experto en componentes de PC (demo portfolio).', NULL, 1
FROM tenants t
WHERE t.slug = 'demo'
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  is_default = VALUES(is_default);

-- Settings KB demo
INSERT INTO kb_settings (kb_id, system_prompt, tone, answer_style, refusal_policy)
SELECT kb.id,
       'Sos un asistente experto en hardware de PC (CPU, GPU, motherboards, RAM, fuentes, almacenamiento, refrigeración, gabinetes) y armado. Respondé SIEMPRE basado en evidencia de los documentos del cliente. Si la evidencia no alcanza, decilo explícitamente y sugerí qué documento o dato falta. Cuando des recomendaciones, pedí contexto mínimo (presupuesto, país, uso, resolución, componentes actuales) y entregá pasos claros.',
       'tecnico',
       JSON_OBJECT('format','paso_a_paso','verbosity','media','include_checklist',true),
       JSON_OBJECT('no_evidence_behavior','say_not_found','require_citations',true)
FROM knowledge_bases kb
JOIN tenants t ON t.id = kb.tenant_id
WHERE t.slug = 'demo' AND kb.name = 'PC Components Expert'
ON DUPLICATE KEY UPDATE
  system_prompt = VALUES(system_prompt),
  tone = VALUES(tone),
  answer_style = VALUES(answer_style),
  refusal_policy = VALUES(refusal_policy);