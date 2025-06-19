class DefinicoesScene extends Phaser.Scene {
  constructor() {
    super('DefinicoesScene');
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
    this.add.text(width / 2, 150, '⚙ DEFINIÇÕES', {
      fontSize: '60px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 6,
      shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 4, fill: true }
    }).setOrigin(0.5);

    // Volume inicial e música de fundo
    if (!this.registry.has('volume')) this.registry.set('volume', 50);
    this.volume = this.registry.get('volume');
    this.sound.setVolume(this.volume / 100);
    const backgroundMusic = this.registry.get('backgroundMusic');
    if (backgroundMusic && !backgroundMusic.isPlaying) backgroundMusic.play();

    // Botão de volume
    this.createStoneButton(
      width / 2, 300,
      `🔊Volume: ${this.volume}%`,
      {
        fontSize: '40px', fill: '#00ff88', fontFamily: 'Arial',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      },
      () => this.aumentarVolume()
    );

    // Botão Voltar
    this.createStoneButton(
      width / 2, 450,
      '⬅ VOLTAR',
      {
        fontSize: '36px', fill: '#00ccff', fontFamily: 'Arial',
        fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
      },
      () => this.scene.start('MainMenuScene')
    );
  }

  // Cria botão com texto e efeito hover
  createStoneButton(x, y, label, textStyle, callback) {
    const button = this.add.sprite(x, y, 'botaomenu').setInteractive({ useHandCursor: true });
    button.setScale(0.35).setDepth(1);

    const txt = this.add.text(x, y, label, textStyle).setOrigin(0.5).setDepth(2);

    // Efeito hover e clique
    button.on('pointerover', () => { txt.setColor('#ffffff'); button.setScale(0.36); });
    button.on('pointerout', () => { txt.setColor(textStyle.fill); button.setScale(0.35); });
    button.on('pointerdown', callback);

    txt.setInteractive({ useHandCursor: true });
    txt.on('pointerover', () => { txt.setColor('#ffffff'); button.setScale(0.35); });
    txt.on('pointerout', () => { txt.setColor(textStyle.fill); button.setScale(0.35); });
    txt.on('pointerdown', callback);

    // Guarda referência para atualizar o texto do volume
    if (label.startsWith('🔊')) this.volumeButton = txt;
  }

  // Aumenta o volume e atualiza o botão
  aumentarVolume() {
    this.volume += 10;
    if (this.volume > 100) this.volume = 0;
    this.sound.setVolume(this.volume / 100);
    this.registry.set('volume', this.volume);
    if (this.volumeButton) this.volumeButton.setText(`🔊Volume: ${this.volume}%`);
    const backgroundMusic = this.registry.get('backgroundMusic');
    if (backgroundMusic) backgroundMusic.setVolume(this.volume / 100);
  }
}

window.DefinicoesScene = DefinicoesScene;
