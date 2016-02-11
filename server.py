import json
import os
import time
from flask import Flask, jsonify, request

app = Flask(__name__, static_url_path='', static_folder='dist')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/api/newPuzzle', methods=['GET', 'POST'])
def comments_handler():
    if request.method == 'GET':
        puzzle = [
            [4, None, 2, None, 3, 1, 7, 6, None],
            [None, 6, None, None, 8, 7, None, None, None],
            [None, None, None, None, 4, None, 1, None, None],
            [8, 9, None, None, None, 2, 6, None, 3],
            [3, None, 5, None, None, None, 4, None, 1],
            [1, None, 6, 3, None, None, None, 8, 5],
            [None, None, 8, None, 9, None, None, None, None],
            [None, None, None, 4, 2, None, None, 5, None],
            [None, 4, 9, 7, 5, None, 3, None, 6]
        ]

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
