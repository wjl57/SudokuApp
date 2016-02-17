import requests
from bs4 import BeautifulSoup, SoupStrainer

def ScrapeNewPuzzle(level=1, puzzle_num=None):
    url = "http://show.websudoku.com/" + "?level=" + str(level)
    if puzzle_num is not None:
        url += "&set_id=" + str(puzzle_num)

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
                    board[j][i] = value
            except:
                pass

    # Find the <a> element with the appropriate title
    href = soup.find("a", {"title":"Copy link for this puzzle"})['href']
    puzzle_num = href.split("set_id=")[1]
    return board, puzzle_num
