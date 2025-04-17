
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:your_password@localhost/svarithm'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    album = db.Column(db.String(100))
    duration = db.Column(db.String(10))
    file_path = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    songs = db.relationship('Song', secondary='playlist_songs')

# Routes
@app.route('/')
def home():
    songs = Song.query.all()
    return render_template('index.html', songs=songs)

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
        'duration': song.duration
    } for song in songs])

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
