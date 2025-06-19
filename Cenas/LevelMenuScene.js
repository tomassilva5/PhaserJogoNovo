class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super('LevelMenuScene');
  }

  preload() {
    this.load.image('menuphaser', 'Assets/menuphaser.png');
    this.load.image('botaomenu', 'Assets/botaomenu.png');
    this.load.audio('backgroundMusic', 'Assets/PleasantCreek.mp3');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fundo e título
    this.add.image(0, 0, 'menuphaser').setOrigin(0).setDisplaySize(width, height);
    this.add.text(width / 2, 150, 'SELECIONA O NÍVEL', {
      fontSize: '56px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 6,
      shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 4, fill: true }
    }).setOrigin(0.5);

    // Volume e música de fundo
    const volume = this.registry.get('volume') || 50;
    this.sound.setVolume(volume / 100);
    const backgroundMusic = this.registry.get('backgroundMusic');
    if (backgroundMusic && !backgroundMusic.isPlaying) backgroundMusic.play();

    // Cria botões com texto e efeito hover
    this.createStoneButton(
      width / 2, 300,
      'NÍVEL 1',
      {
        fontSize: '40px', fill: '#00ff88', fontFamily: 'Arial',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      },
      () => {
        if (backgroundMusic) backgroundMusic.stop();
        this.scene.start('Nivel1');
      }
    );

    this.createStoneButton(
      width / 2, 400,
      'NÍVEL 2',
      {
        fontSize: '40px', fill: '#00ccff', fontFamily: 'Arial',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      },
      () => {
        if (backgroundMusic) backgroundMusic.stop();
        this.scene.start('Nivel2');
      }
    );

    this.createStoneButton(
      width / 2, 500,
      '⬅ VOLTAR',
      {
        fontSize: '36px', fill: '#ffffff', fontFamily: 'Arial',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      },
      () => {
        this.scene.start('MainMenuScene');
      }
    );
  }

  // Cria botão com texto e efeito hover
  createStoneButton(x, y, label, textStyle, callback) {
    const button = this.add.sprite(x, y, 'botaomenu').setInteractive({ useHandCursor: true });
    button.setScale(0.35).setDepth(1);

    const txt = this.add.text(x, y, label, textStyle).setOrigin(0.5).setDepth(2);

    button.on('pointerover', () => { txt.setColor('#ffffff'); button.setScale(0.36); });
    button.on('pointerout', () => { txt.setColor(textStyle.fill); button.setScale(0.35); });
    button.on('pointerdown', callback);

    txt.setInteractive({ useHandCursor: true });
    txt.on('pointerover', () => { txt.setColor('#ffffff'); button.setScale(0.35); });
    txt.on('pointerout', () => { txt.setColor(textStyle.fill); button.setScale(0.35); });
    txt.on('pointerdown', callback);
  }
}

window.LevelMenuScene = LevelMenuScene;
