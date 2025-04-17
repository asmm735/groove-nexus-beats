
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:your_password@localhost/svarithm'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Association table for playlist-song relationship
playlist_songs = db.Table('playlist_songs',
    db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'), primary_key=True),
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'), primary_key=True)
)

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    album = db.Column(db.String(100))
    duration = db.Column(db.String(10))
    file_path = db.Column(db.String(200), nullable=False)  # Path to the actual music file
    album_art = db.Column(db.String(200))  # Path to album artwork
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer)  # You can add proper user authentication later
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    songs = db.relationship('Song', secondary=playlist_songs, backref='playlists')

@app.route('/')
def home():
    songs = Song.query.all()
    playlists = Playlist.query.all()
    return render_template('index.html', songs=songs, playlists=playlists)

@app.route('/search')
def search():
    query = request.args.get('q', '')
    songs = Song.query.filter(
        (Song.title.ilike(f'%{query}%')) |
        (Song.artist.ilike(f'%{query}%')) |
        (Song.album.ilike(f'%{query}%'))
    ).all()
    return jsonify([{
        'id': song.id,
        'title': song.title,
        'artist': song.artist,
        'album': song.album,
        'duration': song.duration,
        'file_path': song.file_path,
        'album_art': song.album_art
    } for song in songs])

@app.route('/album/<album_name>')
def album_view(album_name):
    songs = Song.query.filter_by(album=album_name).all()
    return jsonify([{
        'id': song.id,
        'title': song.title,
        'artist': song.artist,
        'duration': song.duration,
        'file_path': song.file_path,
        'album_art': song.album_art
    } for song in songs])

@app.route('/playlist', methods=['POST'])
def create_playlist():
    data = request.json
    playlist = Playlist(name=data['name'])
    db.session.add(playlist)
    db.session.commit()
    return jsonify({'id': playlist.id, 'name': playlist.name})

@app.route('/playlist/<int:playlist_id>/add', methods=['POST'])
def add_to_playlist(playlist_id):
    data = request.json
    playlist = Playlist.query.get_or_404(playlist_id)
    song = Song.query.get_or_404(data['song_id'])
    playlist.songs.append(song)
    db.session.commit()
    return jsonify({'success': True})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
