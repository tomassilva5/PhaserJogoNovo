class DefinicoesScene extends Phaser.Scene {
  constructor() {
    super('DefinicoesScene');
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

    // Título
    this.add.text(width / 2, 150, '⚙ DEFINIÇÕES', {
      fontSize: '60px',
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

    // Volume inicial
    if (!this.registry.has('volume')) this.registry.set('volume', 50);
    this.volume = this.registry.get('volume');
    this.sound.setVolume(this.volume / 100);

    // Botão de volume
    this.volumeButton = this.add.text(width / 2, 300, `🔊 Volume: ${this.volume}%`, {
      fontSize: '40px',
      fill: '#00ff88',
      fontFamily: 'Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.volumeButton.setColor('#ffffff'))
      .on('pointerout', () => this.volumeButton.setColor('#00ff88'))
      .on('pointerdown', () => this.aumentarVolume());

    // Botão Voltar
    this.createStyledButton(width / 2, 450, '⬅ VOLTAR', () => {
      this.scene.start('MainMenuScene');
    });
  }

  aumentarVolume() {
    this.volume += 10;
    if (this.volume > 100) this.volume = 0;

    this.sound.setVolume(this.volume / 100);
    this.registry.set('volume', this.volume);
    this.volumeButton.setText(`🔊 Volume: ${this.volume}%`);
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
