class LevelMenuScene extends Phaser.Scene {
  constructor() {
    super('LevelMenuScene');
  }

  preload() {
    this.load.image('menuBackground', 'assets/background.png');
  }

  create() {
    this.add.image(0, 0, 'menuBackground')
      .setOrigin(0)
      .setDisplaySize(2000, 800);

    this.add.text(1000, 150, 'Seleciona o Nível', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Botão Nível 1
    this.createButton(1000, 300, 'Nível 1', () => {
      this.scene.stop('Nivel1'); 
      this.scene.start('Nivel1');
    });

    // Botão Nível 2
    this.createButton(1000, 400, 'Nível 2', () => {
      this.scene.stop('Nivel2');
      this.scene.start('Nivel2');
    });

    // Botão Voltar
    this.createButton(1000, 500, 'Voltar', () => {
      this.scene.start('MainMenuScene'); 
    });
  }

  createButton(x, y, text, callback) {
    const btn = this.add.text(x, y, text, {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#444',
      fontFamily: 'Arial'
    })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => btn.setStyle({ fill: '#f1c40f' }))
      .on('pointerout', () => btn.setStyle({ fill: '#fff' }))
      .on('pointerdown', callback);
  }
}
