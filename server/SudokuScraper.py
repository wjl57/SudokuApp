import requests
from bs4 import BeautifulSoup

def ScrapeNewPuzzle(level=1):
    url = "http://show.websudoku.com/" + "?level=" + str(level)
    response = requests.get(url)
    html = response.content

    soup = BeautifulSoup(html, "html.parser")

    puzzle_grid = soup.find(id="puzzle_grid")

    board = [[None for _ in range(0, 9)] for _ in range(0, 9)]
    for i in range(0, 9):
        for j in range(0, 9):
            dom_id = "c" + str(i) + str(j)
            square = puzzle_grid.find(id=dom_id)
            try:
                value = int(square.find('input').get('value'))
                if value is not None:
                    board[i][j] = value
            except:
                pass
    return board
