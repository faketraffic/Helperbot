from flask import Flask, jsonify
import random

app = Flask(__name__)

def read_lines_from_file(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return [line.strip() for line in file.readlines()]


dad_jokes = read_lines_from_file('dadjoke.txt')
would_you_rather_questions = read_lines_from_file('wurather.txt')

@app.route('/api/v1/dadjoke', methods=['GET'])
def get_dad_joke():
    joke = random.choice(dad_jokes)
    return jsonify({"joke": joke})

@app.route('/api/v1/wouldyourather', methods=['GET'])
def get_would_you_rather():
    question = random.choice(would_you_rather_questions)
    return jsonify({"question": question})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
