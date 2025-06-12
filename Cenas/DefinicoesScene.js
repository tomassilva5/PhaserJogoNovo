class DefinicoesScene extends Phaser.Scene {
  constructor() {
    super('DefinicoesScene');
  }

  preload() {
    this.load.image('menuBackground', 'assets/background.png'); // CORRIGIDO caminho
  }

  create() {
    this.add.image(0, 0, 'menuBackground')
      .setOrigin(0)
      .setDisplaySize(2000, 800); // mesmo tamanho

    this.add.text(1000, 150, 'Definições', {
      fontSize: '48px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.soundOn = true;
    this.soundButton = this.add.text(1000, 300, 'Som: Ligado', {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#000'
    })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.toggleSound());

    this.createButton(1000, 450, 'Voltar', () => {
      this.scene.start('MainMenuScene');
    });
  }

  toggleSound() {
    this.soundOn = !this.soundOn;
    this.sound.mute = !this.soundOn;
    this.soundButton.setText('Som: ' + (this.soundOn ? 'Ligado' : 'Desligado'));
  }

  createButton(x, y, text, callback) {
    const btn = this.add.text(x, y, text, {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#000'
    })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => btn.setStyle({ fill: '#f1c40f' }))
      .on('pointerout', () => btn.setStyle({ fill: '#fff' }))
      .on('pointerdown', callback);
  }
}
