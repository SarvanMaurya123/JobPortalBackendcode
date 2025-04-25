CREATE TABLE jobseeker_experience (
    id SERIAL PRIMARY KEY,
    jobseeker_profile_id INTEGER NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    position VARCHAR(100),
    start_date DATE,
    end_date DATE,
    description TEXT,
    currently_working BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_profile_experience
        FOREIGN KEY(jobseeker_profile_id)
        REFERENCES jobseeker_profiles(id)
        ON DELETE CASCADE
);
