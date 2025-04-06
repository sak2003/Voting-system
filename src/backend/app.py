from flask import Flask, render_template, request
import subprocess

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_faces', methods=['POST'])
def add_faces():
    subprocess.Popen(["python", "add_faces.py"])
    return "Face capture process started. Please check your camera window."

@app.route('/give_vote', methods=['POST'])
def give_vote():
    subprocess.Popen(["python", "give_vote.py"])
    return "Vote process started. Please check your camera window."

if __name__ == "__main__":
    app.run(debug=True, port=3000)
