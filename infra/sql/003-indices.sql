-- infra/sql/003-indices.sql
USE chatbot;

-- Tenants / Users
CREATE INDEX idx_users_tenant_active ON users (tenant_id, is_active);
CREATE INDEX idx_users_tenant_created ON users (tenant_id, created_at);

-- KB
CREATE INDEX idx_kb_tenant_default ON knowledge_bases (tenant_id, is_default);

-- Documents
CREATE INDEX idx_documents_kb_status ON documents (kb_id, status);
CREATE INDEX idx_documents_tenant_created ON documents (tenant_id, created_at);
CREATE INDEX idx_documents_openai_file_id ON documents (openai_file_id);

-- Chat
CREATE INDEX idx_chat_sessions_user_updated ON chat_sessions (user_id, updated_at);
CREATE INDEX idx_chat_sessions_kb_updated ON chat_sessions (kb_id, updated_at);

CREATE INDEX idx_chat_messages_session_created ON chat_messages (chat_session_id, created_at);
CREATE INDEX idx_chat_messages_openai_response_id ON chat_messages (openai_response_id);

-- Citations
CREATE INDEX idx_message_citations_message ON message_citations (chat_message_id);
CREATE INDEX idx_message_citations_document ON message_citations (document_id);
CREATE INDEX idx_message_citations_openai_file ON message_citations (openai_file_id);

-- Usage
CREATE INDEX idx_usage_tenant_created ON usage_events (tenant_id, created_at);
CREATE INDEX idx_usage_user_created ON usage_events (user_id, created_at);
CREATE INDEX idx_usage_type_created ON usage_events (type, created_at);