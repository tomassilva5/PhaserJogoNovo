class Nivel2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel2' });
        this.score = 0;
        this.gameOver = false;
    }

    preload() {
        this.load.image('background', 'Assets/background.png');
        this.load.image('ground', 'Assets/ground.png');
        this.load.image('nuvem', 'Assets/nuvem.png');
        this.load.image('bambu', 'Assets/bambu.png');
        this.load.image('lava', 'Assets/lava.png');
        this.load.image('win', 'Assets/win.png');
        this.load.spritesheet('pandapx', 'Assets/pandapx.png', { frameWidth: 70, frameHeight: 100 });
        this.load.audio('jump', 'Assets/jump4.mp3');
        this.load.audio('collect', 'Assets/collect.mp3');
        this.load.audio('gameov', 'Assets/gameov.mp3');
    }

    create() {
        this.add.image(960, 400, 'background').setDisplaySize(1920, 800);

        // Nuvens
        const nuvens = [100, 400, 700, 1000, 1300, 1600];
        nuvens.forEach(x => this.add.image(x, 100, 'nuvem').setScale(0.6));

        // Jogador
        this.player = this.physics.add.sprite(100, 640, 'pandapx');
        this.player.setBounce(0.2).setCollideWorldBounds(true);

        // Plataformas alinhadas em escada
        this.platforms = this.physics.add.staticGroup();
        const platPos = [
            [200, 750], [500, 650], [800, 550], [1100, 450], [1400, 350]
        ];
        platPos.forEach(([x, y]) => this.platforms.create(x, y, 'ground'));

        // Lava abaixo
        this.lava = this.physics.add.staticGroup();
        this.lava.create(600, 790, 'lava').setScale(0.6).refreshBody();

        // Bamboos centralizados em cada plataforma
        this.bamboos = this.physics.add.staticGroup();
        platPos.forEach(([x, y]) => {
            this.bamboos.create(x, y - 50, 'bambu').setScale(0.25).refreshBody();
        });

        // Pontuação
        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '36px', fill: '#000'
        });

        // Animações
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pandapx', { start: 0, end: 3 }),
            frameRate: 10, repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'pandapx', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pandapx', { start: 5, end: 7 }),
            frameRate: 10, repeat: -1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        // Colisões
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.lava, this.player, this.burn, null, this);
        this.physics.add.overlap(this.player, this.bamboos, this.collectBambu, null, this);
    }

    update() {
        if (this.gameOver) return;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.sound.play('jump');
            this.player.setVelocityY(-750);
        }
    }

    collectBambu(player, bambu) {
        bambu.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
        this.sound.play('collect');

        if (this.score === 50) {
            this.add.image(960, 400, 'win');
            this.physics.pause();
            this.player.setTint(0x00ff00);
            this.player.anims.play('turn');
            this.gameOver = true;
        }
    }

    burn(player, lava) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn', false);
        this.gameOver = true;
        this.add.text(700, 400, 'Game Over', {
            fontSize: '48px', fill: '#f00'
        });
        this.sound.play('gameov');
    }
}

window.Nivel2 = Nivel2;
