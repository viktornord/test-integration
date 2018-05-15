CREATE TABLE IF NOT EXISTS albums (
    id serial PRIMARY KEY NOT NULL,
    album TEXT NOT NULL,
    year INT,
    US_peak_chart_post TEXT
);