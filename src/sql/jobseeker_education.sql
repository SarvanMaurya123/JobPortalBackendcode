CREATE TABLE jobseeker_education (
    id SERIAL PRIMARY KEY,
    jobseeker_profile_id INTEGER NOT NULL,
    institution_name VARCHAR(150) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    start_year INT,
    end_year INT,
    grade_or_percentage VARCHAR(20),
    CONSTRAINT fk_profile_education
        FOREIGN KEY(jobseeker_profile_id)
        REFERENCES jobseeker_profiles(id)
        ON DELETE CASCADE
);
