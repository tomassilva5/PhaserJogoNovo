const config = {
    type: Phaser.AUTO,
    width: 2000,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1800 },
            debug: false
        }
    },
    scene: [Nivel1 /*, Nivel2 */]
};


const game = new Phaser.Game(config);
