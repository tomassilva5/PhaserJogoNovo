class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super('LevelMenuScene');
  }

  preload() {
    this.load.image('menuBackground', 'assets/background.png');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(0, 0, 'menuBackground')
      .setOrigin(0)
      .setDisplaySize(width, height);

    // TÍTULO
    this.add.text(width / 2, 150, 'SELECIONA O NÍVEL', {
      fontSize: '56px',
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

    // Botões de nível
    this.createStyledButton(width / 2, 300, 'NÍVEL 1', () => {
      this.scene.start('Nivel1');
    });

    this.createStyledButton(width / 2, 400, 'NÍVEL 2', () => {
      this.scene.start('Nivel2');
    });

    // Botão Voltar
    this.createStyledButton(width / 2, 500, '⬅ VOLTAR', () => {
      this.scene.start('MainMenuScene');
    });
  }

  createStyledButton(x, y, label, callback) {
    const button = this.add.text(x, y, label, {
      fontSize: '36px',
      fill: '#00ccff',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerover', () => button.setColor('#ffffff'));
    button.on('pointerout', () => button.setColor('#00ccff'));
    button.on('pointerdown', callback);
  }
}

window.LevelMenuScene = LevelMenuScene;
