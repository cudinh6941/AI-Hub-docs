export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS prompts (
    id VARCHAR(30) PRIMARY KEY,
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    department VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tool VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    copy_count INTEGER DEFAULT 0,
    updated_at VARCHAR(20) NOT NULL,
    summary TEXT NOT NULL,
    prompt_template TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    why_effective TEXT NOT NULL,
    input_sample TEXT NOT NULL,
    output_sample TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_prompts_dept ON prompts(department);

CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(30) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 5,
    level VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    tool VARCHAR(100) NOT NULL,
    updated_at VARCHAR(20) NOT NULL,
    accent VARCHAR(100) DEFAULT 'from-indigo-500 to-purple-500',
    source_type VARCHAR(50) DEFAULT 'youtube',
    source_url TEXT,
    chapters JSONB NOT NULL DEFAULT '[]'::jsonb,
    transcript TEXT,
    related_prompt_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_videos_slug ON videos(slug);
`
