CREATE TABLE IF NOT EXISTS jobseeker_skills (
    id SERIAL PRIMARY KEY,
    jobseeker_profile_id INTEGER NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50),
    CONSTRAINT fk_profile_skills
        FOREIGN KEY(jobseeker_profile_id)
        REFERENCES jobseeker_profiles(id)
        ON DELETE CASCADE
);
