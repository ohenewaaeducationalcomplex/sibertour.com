-- PostgreSQL schema (simplified)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE voters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_email text UNIQUE NOT NULL,
  full_name text,
  "group" text,
  eligible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE elections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_at timestamptz,
  end_at timestamptz,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);
CREATE TABLE ballots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id uuid REFERENCES elections(id) ON DELETE CASCADE,
  ballot_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  election_id uuid REFERENCES elections(id),
  vote_hash text NOT NULL,
  encrypted_vote bytea,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE ballot_tokens (
  token_hash text PRIMARY KEY,
  voter_email text,
  election_id uuid,
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  used boolean DEFAULT false
);
