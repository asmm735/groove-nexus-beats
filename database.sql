
-- Create the database
CREATE DATABASE svarithm;

-- Connect to the database
\c svarithm;

-- Create songs table
CREATE TABLE song (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    album VARCHAR(100),
    duration VARCHAR(10),
    file_path VARCHAR(200) NOT NULL,
    album_art VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create playlists table
CREATE TABLE playlist (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create playlist_songs association table
CREATE TABLE playlist_songs (
    playlist_id INTEGER REFERENCES playlist(id),
    song_id INTEGER REFERENCES song(id),
    PRIMARY KEY (playlist_id, song_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_song_title ON song(title);
CREATE INDEX idx_song_artist ON song(artist);
CREATE INDEX idx_song_album ON song(album);

