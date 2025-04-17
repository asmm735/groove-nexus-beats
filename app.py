
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:your_password@localhost/svarithm'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

@app.route('/')
def home():
    songs = db.session.execute(db.text('SELECT * FROM song')).fetchall()
    playlists = db.session.execute(db.text('SELECT * FROM playlist')).fetchall()
    return render_template('index.html', songs=songs, playlists=playlists)

@app.route('/search')
def search():
    query = request.args.get('q', '')
    sql = """
        SELECT * FROM song 
        WHERE title ILIKE :query 
        OR artist ILIKE :query 
        OR album ILIKE :query
    """
    songs = db.session.execute(
        db.text(sql), 
        {'query': f'%{query}%'}
    ).fetchall()
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
    sql = "SELECT * FROM song WHERE album = :album"
    songs = db.session.execute(
        db.text(sql), 
        {'album': album_name}
    ).fetchall()
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
    sql = """
        INSERT INTO playlist (name) 
        VALUES (:name) 
        RETURNING id, name
    """
    result = db.session.execute(
        db.text(sql), 
        {'name': data['name']}
    )
    db.session.commit()
    playlist = result.fetchone()
    return jsonify({'id': playlist.id, 'name': playlist.name})

@app.route('/playlist/<int:playlist_id>/add', methods=['POST'])
def add_to_playlist(playlist_id):
    data = request.json
    sql = """
        INSERT INTO playlist_songs (playlist_id, song_id) 
        VALUES (:playlist_id, :song_id)
    """
    db.session.execute(
        db.text(sql), 
        {'playlist_id': playlist_id, 'song_id': data['song_id']}
    )
    db.session.commit()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)

