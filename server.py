from sys import path
path.insert(0, './server')
# SudokuScraper = imp.load_source('SudokuScraper', './server')

import json
import os
import time
import hermes.backend.redis
import hermes.backend.dict
from flask import Flask, jsonify, request
from flask.json import JSONEncoder
from SudokuScraper import ScrapeNewPuzzle
from SudokuLogger import SudokuStepLog
from SudokuPuzzle import SudokuPuzzle
from SudokuSolver import SudokuSolver

class MyJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        if isinstance(obj, list):
            return json.dumps(obj)
        if isinstance(obj, SudokuStepLog):
            return obj.to_json()
        return super(MyJSONEncoder, self).default(obj)

app = Flask(__name__, static_url_path='', static_folder='dist')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
app.json_encoder = MyJSONEncoder
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

cache = hermes.Hermes(hermes.backend.redis.Backend, ttl=600, host='localhost', db=1)
# cache = hermes.Hermes(hermes.backend.dict.Backend)

@app.route('/api/newPuzzle', methods=['POST'])
def generate_puzzle():
    if request.method == 'POST':
        d = request.get_json()
        level = d['level']
        puzzle_requested = d['puzzleNum']
        puzzle, puzzle_num = ScrapeNewPuzzle(level, puzzle_requested)

    return jsonify({
        'puzzle': puzzle,
        'puzzleNum': puzzle_num
    })

@app.route('/api/sudoku/solveStep', methods=['POST'])
def solve_step():
    try:
        board = request.json['board']
        puzzle_name = request.json['puzzleName']
        sp = SudokuPuzzle(board)
        # Check if the puzzle has a solution
        validate_puzzle(puzzle_name, board)

        # Solve the next step
        spStep = SudokuPuzzle(board)
        ssStep = SudokuSolver(spStep)
        ssStep.solve_next_step()
        log = ssStep.sudoku_logger.sudoku_log
        return jsonify({
            'success': True,
            'board': ssStep.sudoku_puzzle.get_board(),
            'steps_log': log
        })
    except Exception as e:
        print(e)
        return jsonify({
            'success': False
        })

@app.route('/api/sudoku/solveCell', methods=['POST'])
def solve_cell():
    try:
        board = request.json['board']
        puzzle_name = request.json['puzzleName']
        # Check if the puzzle has a solution
        validate_puzzle(puzzle_name, board)

        spStep = SudokuPuzzle(board)
        ssStep = SudokuSolver(spStep)
        ssStep.solve_cell()
        log = ssStep.sudoku_logger.sudoku_log
        return jsonify({
            'success': True,
            'board': ssStep.sudoku_puzzle.get_board(),
            'steps_log': log
        })
    except Exception as e:
        print(e)
        return jsonify({
            'success': False
        })

@app.route('/api/sudoku/solvePuzzle', methods=['POST'])
def solve_puzzle():
    try:
        board = request.json['board']
        puzzle_name = request.json['puzzleName']
        # Check if the puzzle has a solution
        validate_puzzle(puzzle_name, board)

        sp = SudokuPuzzle(board)
        ss = SudokuSolver(sp)
        ss.do_work()
        log = ss.sudoku_logger.sudoku_log
        return jsonify({
            'success': True,
            'board': ss.sudoku_puzzle.get_board(),
            'steps_log': log
        })
    except Exception as e:
        print(e)
        return jsonify({
            'success': False
        })

@cache(key = lambda fn, *args, **kwargs: 'avg:{0}'.format(*args))
def get_solution(puzzle_name, board):
    print("ACTUALLY SOLVING")
    sp = SudokuPuzzle(board)
    ss = SudokuSolver(sp)
    ss.do_work()
    return ss.sudoku_puzzle.get_board()

def validate_puzzle(puzzle_name, board):
    solution = get_solution(puzzle_name, board)
    for y in range(0, 9):
        for x in range(0, 9):
            if board[y][x] is not None and board[y][x] != solution[y][x]:
                # TODO: Make this a custom exception
                raise Exception("No solution found")


if __name__ == "__main__":
    app.run(host='0.0.0.0')
