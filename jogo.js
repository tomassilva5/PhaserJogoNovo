const config = {
  type: Phaser.AUTO,
  width: 2000,
  height: 800,
  parent: 'game-container', 
  backgroundColor: '#ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1800 },
      debug: false
    }
  },
  scene: [MainMenuScene, LevelMenuScene, DefinicoesScene, Nivel1, Nivel2]
};

const game = new Phaser.Game(config); // Inicialização do jogo

// Ajusta o canvas para ser responsivo ao tamanho da janela
window.onload = () => {
  resize();
  window.addEventListener('resize', resize, false);
};

function resize() {
  const canvas = document.querySelector('canvas');
  if (!canvas) return;

  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.display = 'block';
  canvas.style.margin = '0';
  canvas.style.padding = '0';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
}


