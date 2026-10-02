let board = null;
let game = new Chess();
let currentLevel = 0;

// List of puzzles: FEN, expected solution move (LAN format like 'e2e4'), and the message
const levels = [
    {
        rating: 200,
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        solution: "g8f6", // Example simple defense move
        message: "🎉 Level 1 unlocked! 🔓\n\nOkay, you’re smarter than I thought. 👀😂"
    },
    {
        rating: 500,
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        solution: "f3g5",
        message: "Level 2 unlocked 🔓❤️\n\nI like your eyes, your voice…\nand that big big noseeee of yours. 👀😂❤️"
    },
    {
        rating: 800,
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 6",
        solution: "e1g1",
        message: "Level 3 unlocked 🔓❤️\n\nOkay, your smile is kinda dangerous too… 😏\nBut don’t smile too much—you still have a puzzle to solve. 😂♟️\n\n9 more… let’s see if you can keep up. 😏❤️"
    },
    {
        rating: 1000,
        fen: "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPPN1PPP/R1BQ1RK1 b - - 3 7",
        solution: "d7d6",
        message: "Level 4 unlocked 🔓❤️\n\nI don’t know when it happened…\nbut somehow, talking to you became my favourite part of the day. 🫠❤️"
    },
    {
        rating: 1200,
        fen: "r1bq1rk1/pp1pnppp/2np4/2b1p3/2B1P3/3P1N2/PPPN1PPP/R1BQ1RK1 w - - 0 8",
        solution: "c2c3",
        message: "Level 5 unlocked 🔓❤️\n\nI love listening to you…\nsometimes I just want you to keep talking, while I sit there and listen to you forever. 🫠❤️"
    },
    {
        rating: 1400,
        fen: "r1bq1rk1/pp1pnppp/2np4/2b1p3/2B1P3/1QPP1N2/PP1N1PPP/R1B2RK1 b - - 0 9",
        solution: "c5b6",
        message: "Level 6 unlocked 🔓❤️\n\nHaaaye, tumhari aankheinnn… 👀❤️\nI could just stare into your eyes forever."
    },
    {
        rating: 1600,
        fen: "r1bq1rk1/pp1pnppp/1bnp4/4p3/2B1P3/1QPP1N2/PP1N1PPP/R1B2RK1 w - - 1 10",
        solution: "a2a4",
        message: "Level 7 unlocked 🔓❤️\n\nI don’t know what it is about you…\nbut somehow, I always end up wanting a little more of you. ❤️\nAnd honestly… I’m not even complaining. 😏"
    },
    {
        rating: 1800,
        fen: "r1bq1rk1/pp2nppp/1bnp4/4p3/N1B1P3/1QPP1N2/1P1N1PPP/R1B2RK1 b - - 0 11",
        solution: "b6c7",
        message: "Puzzle 8\nLevel 8 unlocked 🔓❤️\nI think I’m falling for you… 🫠❤️"
    },
    {
        rating: 1900,
        fen: "r1bq1rk1/ppbn1ppp/2np4/4p3/N1B1P3/1QPP1N2/1P1N1PPP/R1B2RK1 w - - 1 12",
        solution: "b2b4",
        message: "Puzzle 9\nLevel 9 unlocked 🔓❤️\nYou’ve become really special to me. ❤️"
    },
    {
        rating: 2000,
        fen: "r2q1rk1/ppbn1ppp/2npb3/4p3/NPB1P3/2PP1N2/3N1PPP/R1BQ1RK1 b - - 0 13",
        solution: "e8g8",
        message: "Puzzle 10\nLevel 10 unlocked 🔓❤️\nNo more puzzles…\nI love you. ❤️"
    }
];

function loadLevel(index) {
    if (index >= levels.length) {
        $('#game-container').html(`<h2>You finished everything! ❤️</h2><p>Refresh to play again.</p>`);
        return;
    }

    currentLevel = index;
    game.load(levels[currentLevel].fen);
    
    $('#level-title').text(`Level ${currentLevel + 1} (Rating: ~${levels[currentLevel].rating})`);
    $('#message-box').hide();
    $('#instruction').show();

    let config = {
        position: levels[currentLevel].fen,
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    
    // Clear old board and make new one
    $('#board').empty();
    board = Chessboard('board', config);
}

function onDragStart(source, piece, position, orientation) {
    // Only allow moving the correct side's pieces
    if (game.game_over()) return false;
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
}

function onDrop(source, target) {
    // See if the move is legal in chess terms
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for simplicity
    });

    if (move === null) return 'snapback';

    let playedMoveStr = source + target;
    let expectedMoveStr = levels[currentLevel].solution;

    if (playedMoveStr === expectedMoveStr) {
        // Correct move! Show message
        $('#instruction').hide();
        $('#message-text').text(levels[currentLevel].message);
        $('#message-box').fadeIn();
    } else {
        // Wrong move, undo it
        game.undo();
        return 'snapback';
    }
}

function onSnapEnd() {
    board.position(game.fen());
}

function nextLevel() {
    loadLevel(currentLevel + 1);
}

// Initialize the first level on load
$(document).ready(function() {
    loadLevel(0);
});
