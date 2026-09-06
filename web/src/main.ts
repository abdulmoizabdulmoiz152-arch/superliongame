import './styles/main.css';
import './styles/hud.css';
import './styles/menus.css';
import { GameManager } from './game/GameManager';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Render canvas not found!');
    return;
  }

  // Prevent context menu on mobile touch hold
  window.addEventListener('contextmenu', (e) => e.preventDefault());

  // Initialize Game Manager
  const gameManager = new GameManager(canvas);

  // Expose to window for debugging if needed
  (window as unknown as { __gameManager: GameManager }).__gameManager = gameManager;
});
