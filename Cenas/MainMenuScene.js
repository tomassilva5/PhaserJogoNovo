class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  preload() {
    this.load.image('background', 'assets/background.png');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(width, height);

    // TÍTULO
    this.add.text(width / 2, 150, 'MENU PRINCIPAL', {
      fontSize: '72px',
      fill: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000',
        blur: 4,
        fill: true
      }
    }).setOrigin(0.5);

    // BOTÃO JOGAR
    const jogar = this.add.text(width / 2, 350, '▶ JOGAR', {
      fontSize: '52px',
      fill: '#00ff88',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    jogar.on('pointerover', () => jogar.setColor('#ffffff'));
    jogar.on('pointerout', () => jogar.setColor('#00ff88'));
    jogar.on('pointerdown', () => {
      this.scene.start('LevelMenuScene');
    });

    // BOTÃO DEFINIÇÕES
    const definicoes = this.add.text(width / 2, 450, '⚙ DEFINIÇÕES', {
      fontSize: '40px',
      fill: '#00ccff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    definicoes.on('pointerover', () => definicoes.setColor('#ffffff'));
    definicoes.on('pointerout', () => definicoes.setColor('#00ccff'));
    definicoes.on('pointerdown', () => {
      this.scene.start('DefinicoesScene');
    });

    // BOTÃO SAIR
    const sair = this.add.text(width / 2, 550, 'SAIR', {
      fontSize: '36px',
      fill: '#ff4d4d',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    sair.on('pointerover', () => sair.setColor('#ffffff'));
    sair.on('pointerout', () => sair.setColor('#ff4d4d'));
    sair.on('pointerdown', () => {
      // ⚠️ Se estiver em Electron/desktop app, podes usar: window.close()
      // No navegador, apenas simula ou avisa
      console.log('Sair do jogo');

      // Simulação no navegador
      this.add.text(width / 2, 650, 'Não é possível sair do jogo no navegador.', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    });

    window.MainMenuScene = MainMenuScene;
  }
}
