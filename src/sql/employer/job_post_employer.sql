CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    employer_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    experience_level VARCHAR(50) DEFAULT 'Entry-level',
    salary VARCHAR(100),
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    application_deadline DATE,
    contact_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_employer
        FOREIGN KEY (employer_id)
        REFERENCES employers(id)
        ON DELETE CASCADE
);
