class DefinicoesScene extends Phaser.Scene {
  constructor() {
    super('DefinicoesScene');
  }

  preload() {
    this.load.image('menuBackground', 'assets/background.png');
  }

  create() {
    this.add.image(0, 0, 'menuBackground')
      .setOrigin(0)
      .setDisplaySize(2000, 800);

    this.add.text(1000, 150, 'Definições', {
      fontSize: '48px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Volume inicial
    if (!this.registry.has('volume')) this.registry.set('volume', 50);
    this.volume = this.registry.get('volume');
    this.sound.setVolume(this.volume / 100);

    this.volumeButton = this.add.text(1000, 300, `Volume: ${this.volume}%`, {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#000'
    }).setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.aumentarVolume());

    this.createButton(1000, 450, 'Voltar', () => {
      this.scene.start('MainMenuScene');
    });
  }

  aumentarVolume() {
    this.volume += 10;
    if (this.volume > 100) this.volume = 0;

    this.sound.setVolume(this.volume / 100);
    this.registry.set('volume', this.volume);
    this.volumeButton.setText(`Volume: ${this.volume}%`);
  }

  createButton(x, y, text, callback) {
    const btn = this.add.text(x, y, text, {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#000'
    }).setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => btn.setStyle({ fill: '#f1c40f' }))
      .on('pointerout', () => btn.setStyle({ fill: '#fff' }))
      .on('pointerdown', callback);
  }
}
