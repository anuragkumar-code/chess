import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { getBestMove } from "./ai";

const game = new Chess();

function App() {
  const [fen, setFen] = useState(game.fen());
  const [pgn, setPgn] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const playAI = () => {
      if (game.isGameOver()) return;

      const move = getBestMove(game);
      if (move) {
        const moveResult = game.move(move);
        if (moveResult) {
          setLastMove({ from: moveResult.from, to: moveResult.to });
          setFen(game.fen());
          setPgn(game.pgn());
        }
      }
    };

    const interval = setInterval(playAI, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [pgn]);

  const formatPgn = (pgn: string) => {
    const cleanPgn = pgn.replace(/\[.*?\]\s*/g, "").trim();
    return cleanPgn
      .split(/\s(?=\d+\.)/)
      .map((line, idx) => <div key={idx}>{line.trim()}</div>);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col p-4 overflow-hidden">
      <header className="text-2xl font-semibold text-center">
        ♟️ AI vs AI Chess Battle
      </header>

      <div className="mt-2 flex justify-center">
        <button
          onClick={toggleDark}
          className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-row gap-4 flex-1 mt-4 overflow-hidden mx-auto">
        <div className="flex-1 flex justify-center items-center">
          <div className="aspect-square w-full max-w-[500px]">
            <Chessboard
              position={fen}
              arePiecesDraggable={false}
              boardWidth={500}
              customSquareStyles={{
                ...(lastMove?.from && {
                  [lastMove.from]: {
                    background:
                      "radial-gradient(circle, rgba(255,255,0,0.6) 36%, transparent 37%)",
                  },
                }),
                ...(lastMove?.to && {
                  [lastMove.to]: {
                    background:
                      "radial-gradient(circle, rgba(255,255,0,0.6) 36%, transparent 37%)",
                  },
                }),
              }}
            />
          </div>
        </div>

        <div
          className="w-[25%] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded p-4 text-sm leading-relaxed shadow-inner"
          ref={historyRef}
        >
          <h2 className="font-medium mb-2 text-lg">📜 Move History</h2>
          {pgn ? formatPgn(pgn) : <p className="italic">Waiting for moves...</p>}
        </div>
      </div>

      <footer className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
        Built with ♡ — Visit{" "}
        <a
          href="https://jarwis.in"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600 dark:hover:text-blue-400"
        >
          Jarwis
        </a>
      </footer>
    </div>
  );
}

export default App;
