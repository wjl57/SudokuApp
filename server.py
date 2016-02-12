from sys import path
path.insert(0, './server')
# SudokuScraper = imp.load_source('SudokuScraper', './server')

import json
import os
import time
from flask import Flask, jsonify, request
from SudokuScraper import ScrapeNewPuzzle

app = Flask(__name__, static_url_path='', static_folder='dist')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/api/newPuzzle', methods=['POST'])
def comments_handler():
    if request.method == 'POST':
        d = request.get_json()
        level = d['level']
        puzzle = ScrapeNewPuzzle(level)

    return jsonify({'puzzle': puzzle})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = [
        {
            'id': 1,
            'title': u'Buy groceries',
            'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
            'done': False
        },
        {
            'id': 2,
            'title': u'Learn Python',
            'description': u'Need to find a good Python tutorial on the web',
            'done': False
        }
    ]
    return jsonify({'tasks': tasks})

if __name__ == "__main__":
    app.run(host='0.0.0.0')
