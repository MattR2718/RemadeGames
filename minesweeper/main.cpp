#include <SFML/Graphics.hpp>
#include <iostream>
#include <vector>
#include <map>
#include <time.h>
#include <Windows.h>

void printBoard(std::vector<std::vector<char>>& board) {
    std::cout << "--------------------------\n";
    for (int y = 0; y < board[1].size(); y++) {
        for (int x = 0; x < board.size(); x++) {
            std::cout << board[x][y];
        }
        std::cout << '\n';
    }
    std::cout << "--------------------------\n";
}

char checkBombs(std::vector<std::vector<char>>& board, int x, int y) {
    if (board[x][y] == 35) { return 35; } //If bomb
    int bombs = 0;

    for (int j = -1; j < 2; j++) {
        for (int i = -1; i < 2; i++) {
            if ((x + i > -1) && (x + i < board.size()) && (y + j > -1) && (y + j < board[1].size())) {
                if (board[x + i][y + j] == 35) { bombs++; }
            }
        }
    }

    if (bombs != 0) { return '0' + bombs; }
    return 32;
}

void fillBoard(std::vector<std::vector<char>>& board, const int &mineNum, std::vector<std::vector<bool>>& coverBoard, std::vector<std::vector<bool>>& flagBoard) {
    for (int m = 0; m < mineNum; m++) {
        int x = 0;
        int y = 0;
        do {
            x = rand() % board.size();
            y = rand() % board[1].size();
        } while (board[x][y] == 35);
        //Ascii code for #
        board[x][y] = 35;
    }
    for (int y = 0; y < board[1].size(); y++) {
        for (int x = 0; x < board.size(); x++) {
            board[x][y] = checkBombs(board, x, y);
            coverBoard[x][y] = 1;
            flagBoard[x][y] = 0;
        }
    }
}

bool validBoardSpace(std::vector<std::vector<char>>& board, int x, int y) {
    if ((x > -1) && (x < board.size()) && (y > -1) && (y < board[1].size())) {
        return true;
    }
    return false;
}
void blankSpace(std::vector<std::vector<char>>& board, std::vector<std::vector<bool>>& coverBoard, int x, int y) {
    if ((validBoardSpace(board, x, y)) && (coverBoard[x][y] == 1) && (board[x][y] == ' ')) {
        coverBoard[x][y] = 0;
        blankSpace(board, coverBoard, x + 1, y);
        blankSpace(board, coverBoard, x - 1, y);
        blankSpace(board, coverBoard, x, y + 1);
        blankSpace(board, coverBoard, x, y - 1);
    }
    else if ((validBoardSpace(board, x, y)) && (board[x][y] != '#')) {
        coverBoard[x][y] = 0;
    }
    return;
}

void lose(std::vector<std::vector<char>>& board, std::vector<std::vector<bool>>& coverBoard, std::vector<std::vector<bool>>& flagBoard, bool& lost) {
    for (int y = 0; y < board[1].size(); y++) {
        for (int x = 0; x < board.size(); x++) {
            if (board[x][y] == 35) {
                coverBoard[x][y] = 0;
                flagBoard[x][y] = 0;
            }
        }
    }
    lost = true;
}

void showBoard(std::vector<std::vector<char>>& board, std::vector<std::vector<bool>>& coverBoard, std::vector<std::vector<bool>>& flagBoard, int& x, int& y, bool& lost) {
    //Bomb hit
    if (board[x][y] == 35) { 
        coverBoard[x][y] = 0;
        lose(board, coverBoard, flagBoard, lost);
        return; 
    }

    if (board[x][y] != ' ') { coverBoard[x][y] = 0; return; }
    blankSpace(board, coverBoard, x, y);
}

void checkWin(std::vector<std::vector<char>>& board, std::vector<std::vector<bool>>& flagBoard, std::vector<std::vector<bool>>& coverBoard, bool& won) {
    for (int y = 0; y < board[1].size(); y++) {
        for (int x = 0; x < board.size(); x++) {
            if ((board[x][y] == 35) && (flagBoard[x][y] == 0)) {
                return;
            }
            else if ((board[x][y] != 35) && (flagBoard[x][y] == 1)) {
                return;
            }
        }
    }
    won = true;
    for (int y = 0; y < board[1].size(); y++) {
        for (int x = 0; x < board.size(); x++) {
            coverBoard[x][y] = 0;
        }
    }
}

int main() {
    //Constants
    const int lineWidth = 5;
    const int cellSize = 50;
    const int windowX = 1000;
    const int windowY = 900;
    const int mineNum = 20;
    
    bool lost = false;
    bool won = false;

    //Create map of colours
    std::map<char, sf::Color> colours;
    colours['1'] = sf::Color::Blue;
    colours['2'] = sf::Color::Green;
    colours['3'] = sf::Color::Red;
    colours['4'] = sf::Color(148,0,211);
    colours['5'] = sf::Color(128,0,0);
    colours['6'] = sf::Color(64,224,208);
    colours['7'] = sf::Color::Black;
    colours['8'] = sf::Color(128,128,128);
    colours['#'] = sf::Color::Black;

    //Seed random numbers
    srand(time(NULL));

    //Create and initialise board
    std::vector<std::vector<char>> board(int(windowX / cellSize));
    std::vector<std::vector<bool>> coverBoard(int(windowX / cellSize));
    std::vector<std::vector<bool>> flagBoard(int(windowX / cellSize));
    for (int i = 0; i < int(windowX / cellSize); i++) {
        board[i].resize(int(windowY / cellSize));
        coverBoard[i].resize(int(windowY / cellSize));
        flagBoard[i].resize(int(windowY / cellSize));
    }

    fillBoard(board, mineNum, coverBoard, flagBoard);
    //printBoard(board);


    //Font
    sf::Font font;
    font.loadFromFile("arial.ttf");

    //Create the window
    sf::RenderWindow window(sf::VideoMode(windowX, windowY), "Minesweeper");

    window.setFramerateLimit(15);

    while (window.isOpen()) {

        // check all the window's events that were triggered since the last iteration of the loop
        sf::Event event;
        while (window.pollEvent(event))
        {
            // "close requested" event: we close the window
            if (event.type == sf::Event::Closed)
                window.close();
        }

        // clear the window with black color
        if (won) {
            window.clear(sf::Color::Green);
        }
        else { window.clear(sf::Color::White); }

        // draw everything here...
        // window.draw(...);
        //
        
        //Draw board
        sf::RectangleShape cell(sf::Vector2f(cellSize, cellSize));
        for (int x = 0; x < int(windowX / cellSize); x++) {
            for (int y = 0; y < int(windowY / cellSize); y++) {
                sf::Text text(board[x][y], font);
                text.setCharacterSize(cellSize);
                text.setFillColor(colours[board[x][y]]);
                int offset = int(text.getGlobalBounds().width / 2);
                text.setPosition((x * cellSize) + int(cellSize / 2) - offset, (y * cellSize) - 10);
                window.draw(text);

                if (coverBoard[x][y] == 1) {
                    cell.setPosition((x * cellSize), (y * cellSize));
                    cell.setFillColor(sf::Color(200,200,200));
                    window.draw(cell);
                }

                if (flagBoard[x][y] == 1) {
                    cell.setPosition((x * cellSize), (y * cellSize));
                    cell.setFillColor(sf::Color::Red);
                    window.draw(cell);
                }
            }
        }

        //Grid
        //Horizontal
        sf::RectangleShape hLine(sf::Vector2f(windowX, lineWidth));
        hLine.setFillColor(sf::Color::Black);
        for (int y = 0; y < windowY; y += cellSize) {
            hLine.setPosition(0, y - int(lineWidth / 2));
            window.draw(hLine);
        }
        //Vertical
        sf::RectangleShape vLine(sf::Vector2f(lineWidth, windowY));
        vLine.setFillColor(sf::Color::Black);
        for (int x = 0; x < windowX; x += cellSize) {
            vLine.setPosition(x - int(lineWidth / 2), 0);
            window.draw(vLine);
        }

        if ((sf::Mouse::isButtonPressed(sf::Mouse::Left)) && (!lost)){
            int x = floor(sf::Mouse::getPosition(window).x / cellSize);
            int y = floor(sf::Mouse::getPosition(window).y / cellSize);
            //coverBoard[x][y] = 0;
            if (validBoardSpace(board, x, y)) {
                showBoard(board, coverBoard, flagBoard, x, y, lost);
            }
        }

        if ((sf::Mouse::isButtonPressed(sf::Mouse::Right)) && (!lost)) {
            int x = floor(sf::Mouse::getPosition(window).x / cellSize);
            int y = floor(sf::Mouse::getPosition(window).y / cellSize);
            if (sf::Keyboard::isKeyPressed(sf::Keyboard::LControl) && (validBoardSpace(board, x, y))) {
                flagBoard[x][y] = 0;
            }
            else if (validBoardSpace(board, x, y)) {
                flagBoard[x][y] = 1;
                checkWin(board, flagBoard, coverBoard, won);
            }
        }

        // end the current frame
        window.display();
    }
}
