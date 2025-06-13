class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
    this.load.image('background', 'assets/background.png');
  }

  create() {
    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(2000, 800); // fundo igual ao tamanho do jogo

    this.add.text(1000, 150, 'MENU PRINCIPAL', {
      fontSize: '64px',
      fill: '#fff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // ✅ Agora vai para o menu de níveis!
    const jogar = this.add.text(1000, 350, 'JOGAR', {
      fontSize: '48px',
      fill: '#0f0',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setInteractive();

    jogar.on('pointerdown', () => {
      this.scene.start('LevelMenuScene'); // <== CORRIGIDO AQUI
    });

    const definicoes = this.add.text(1000, 450, 'DEFINIÇÕES', {
      fontSize: '36px',
      fill: '#0ff',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setInteractive();

    definicoes.on('pointerdown', () => {
      this.scene.start('DefinicoesScene');
    });
    window.MainMenuScene = MainMenuScene;
  }
}
