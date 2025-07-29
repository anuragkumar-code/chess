import { Chess } from "chess.js";

export function getBestMove(game: Chess): string | null {
  const moves = game.moves();
  if (moves.length === 0) return null;
  const move = moves[Math.floor(Math.random() * moves.length)];
  return move;
}
