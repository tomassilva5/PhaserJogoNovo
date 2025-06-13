// Assets/Cenas/nivel2.js

class Nivel2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel2' });
        this.score = 0;
        this.gameOver = false;
    }

    preload() {
        // Barra de loading
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const progressBox = this.add.graphics();
        const progressBar = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width/2 - 160, height/2 - 25, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: { font: '20px monospace', fill: '#ffffff' }
        }).setOrigin(0.5);
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: { font: '18px monospace', fill: '#ffffff' }
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width/2 - 150, height/2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Assets do nível 2
        this.load.image('back', 'Assets/back2.jpeg');
        this.load.image('watwave2', 'Assets/watwave.png');
        this.load.image('cloud', 'Assets/cloud2.png');
        this.load.image('platform', 'Assets/ground2.png');
        this.load.image('platformsm', 'Assets/groundsm2.png');
        this.load.image('win2', 'Assets/win2.png');
        this.load.image('bambu', 'Assets/bambu.png');
        this.load.image('pass2', 'Assets/key2.png');
        this.load.image('button2', 'Assets/button2.png');
        this.load.image('doorc2', 'Assets/doorc2.png');
        this.load.image('dooro2', 'Assets/dooro2.png');
        this.load.image('rain2', 'Assets/rain2.png');
        this.load.image('gameover2', 'Assets/gameover2.png');
        this.load.spritesheet('pandapx2', 'Assets/pandapx2.png', { frameWidth: 70, frameHeight: 100 });
        this.load.spritesheet('startBtn', 'Assets/startBtn.png', { frameWidth: 60, frameHeight: 60 });
        this.load.audio('jump', 'Assets/jump4.mp3');
        this.load.audio('collect', 'Assets/collect.mp3');
        this.load.audio('gameov', 'Assets/gameov.mp3');
        this.load.audio('buttsound', 'Assets/buttsound.mp3');
        this.load.audio('gateop', 'Assets/gateop.mp3');
    }

    create() {
        this.add.image(1000, 400, 'back');

        // Chuva
        this.add.image(100, 460, 'rain2');
        this.add.image(800, 480, 'rain2');        
        this.add.image(1540, 480, 'rain2');
        this.add.image(2000, 450, 'rain2');

        // Nuvens
        [50, 350, 700, 800, 1140, 1400, 1740, 1900].forEach(x => {
            this.add.image(x, Phaser.Math.Between(30, 100), 'cloud');
        });

        // Plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(800, 760, 'platform');
        this.platforms.create(2400, 760, 'platform');

        this.smplat = this.physics.add.staticGroup();
        this.smplat.create(350, 580, 'platformsm').setScale(0.3).refreshBody();

        this.smplatw = this.physics.add.staticGroup();
        this.smplatw.create(680, 430, 'platformsm').setScale(0.3).refreshBody();

        // Comida (maçãs)
        this.food = this.physics.add.staticGroup();
        this.food.create(680, 480, 'apple');
        this.food.create(1280, 580, 'apple');
        this.food.create(1250, 70, 'apple');

        // Pass (chave)
        this.pass = this.physics.add.staticGroup();

        // Botões
        this.buttons = this.physics.add.staticGroup();

        // Portas
        this.doorsc2 = this.physics.add.staticGroup();
        this.doorso2 = this.physics.add.staticGroup();

        // Jogador
        this.player = this.physics.add.sprite(50, 640, 'pandapx2');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Animações
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pandapx2', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'pandapx2', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pandapx2', { start: 5, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Score text
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '36px', fill: '#fff' });

        // Colisões e overlaps
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.smplat, this.player);
        this.physics.add.collider(this.smplatw, this.player, this.death, null, this);
        this.physics.add.collider(this.player, this.doorsc2).name = 'doorcr';
        this.physics.add.collider(this.player, this.buttons, this.showall, null, this).name = 'butt';
        this.physics.add.overlap(this.player, this.food, this.collecta, null, this);
        this.physics.add.overlap(this.player, this.pass, this.last, null, this);
        this.physics.add.collider(this.player, this.doorso2, this.win, null, this);

        // Variáveis auxiliares
        this.gameOver = false;
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

    collecta(player, food) {
        food.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
        this.sound.play('collect');
    }

    last(player, pass) {
        pass.disableBody(true, true);
        this.score += 20;
        this.scoreText.setText('score:' + this.score);

        if (this.score === 50) {
            this.doorso2.create(1920, 130, 'dooro2').setScale(1.5).refreshBody();
            this.sound.play('gateop');

            this.smplat.create(1660, 380, 'platformsm').setScale(0.3).refreshBody();

            this.physics.world.colliders.remove(
                this.physics.world.colliders.getActive().find(i => i.name === 'doorcr')
            );

            this.sound.play('collect');
        } else {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.player.anims.play('turn', false);
            this.gameOver = true;
            this.sound.play('gameov');
            this.add.image(940, 350, 'gameover2');
            this.add.text(700, 450, 'Collect all apples first', { fontSize: '36px', fill: '#fff' });

            this.startBtn = this.add.sprite(940, 550, 'startBtn').setInteractive();
            this.startBtn.on('pointerdown', () => this.scene.restart());
        }
    }

    death(player, smplatw) {
        // Cria ondas de água perigosas
        this.watwave2 = this.physics.add.staticGroup();
        this.watwave2.create(400, 745, 'watwave2').setScale(1.2).refreshBody();
        this.watwave2.create(1200, 745, 'watwave2').setScale(1.2).refreshBody();
        this.watwave2.create(2000, 745, 'watwave2').setScale(1.2).refreshBody();

        this.physics.add.collider(this.watwave2, this.player, this.drown, null, this);
        this.physics.add.collider(this.platforms, this.watwave2, this.delpl, null, this);

        this.smplat.create(80, 250, 'platformsm').setScale(0.3).refreshBody();
        this.smplat.create(480, 150, 'platformsm').setScale(0.3).refreshBody();
        this.smplat.create(920, 290, 'platformsm').setScale(0.3).refreshBody();

        this.pass.create(1600, 480, 'pass2');
        this.buttons.create(60, 235, 'button2');

        this.smplat.create(680, 430, 'platformsm').setScale(0.3).refreshBody();

        this.physics.world.colliders.remove(
            this.physics.world.colliders.getActive().find(i => i.name === 'platf')
        );
    }

    drown() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn', false);
        this.gameOver = true;
        this.sound.play('gameov');
        this.add.image(940, 350, 'gameover2');

        this.startBtn = this.add.sprite(940, 500, 'startBtn').setInteractive();
        this.startBtn.on('pointerdown', () => this.scene.restart());
    }

    showall() {
        this.sound.play('buttsound');
        this.smplat.create(1600, 670, 'platformsm').setScale(0.3).refreshBody();
        this.smplat.create(1800, 670, 'platformsm').setScale(0.3).refreshBody();
        this.smplat.create(2000, 670, 'platformsm').setScale(0.3).refreshBody();

        this.smplat.create(1900, 250, 'platformsm').setScale(0.3).refreshBody();

        this.smplat.create(1280, 530, 'platformsm').setScale(0.3).refreshBody();

        this.doorsc2.create(1920, 130, 'doorc2').setScale(1.5).refreshBody();

        this.buttons2 = this.physics.add.staticGroup();
        this.buttons2.create(60, 235, 'button2');
        this.physics.add.collider(this.player, this.buttons2);

        this.physics.world.colliders.remove(
            this.physics.world.colliders.getActive().find(i => i.name === 'butt')
        );
    }

    win() {
        this.physics.pause();
        this.player.setTint(0x008000);
        this.player.anims.play('turn');
        this.gameOver = true;
        this.add.image(940, 350, 'win2');
    }

    delpl(platform, watwave) {
        platform.disableBody(true, true);
    }
}

window.Nivel2 = Nivel2;
