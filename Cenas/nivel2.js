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
        this.load.image('back', 'Assets/background.png');
        this.load.image('watwave2', 'Assets/lava2.png');
        this.load.image('cloud', 'Assets/nuvem.png');
        this.load.image('ground', 'Assets/ground.png');
        this.load.image('groundsm', 'Assets/groundsm.png');
        this.load.image('win2', 'Assets/win.png');
        this.load.image('bambu', 'Assets/bambu.png');
        this.load.image('pass2', 'Assets/pass.png');
        //this.load.image('button2', 'Assets/startBtn.png'); 
        this.load.image('doorc2', 'Assets/doorc.png');
        this.load.image('dooro2', 'Assets/dooro.png');
        this.load.image('gameover2', 'Assets/gameover.png');
        this.load.spritesheet('pandapx2', 'Assets/pandapx.png', { frameWidth: 70, frameHeight: 100 });
        this.load.spritesheet('startBtn', 'Assets/startBtn.png', { frameWidth: 60, frameHeight: 60 });
        this.load.audio('jump', 'Assets/jump4.mp3');
        this.load.audio('collect', 'Assets/collect.mp3');
        this.load.audio('gameov', 'Assets/gameov.mp3');
        this.load.audio('gateop', 'Assets/gateop.mp3');

    }

    create() {
        // Fundo azul
        this.add.image(0, 0, 'back')
        .setOrigin(0, 0)
        .setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);


        // Nuvens
        this.add.image(50, 80, 'cloud');
        this.add.image(350, 60, 'cloud');
        this.add.image(700, 100, 'cloud');
        this.add.image(800, 70, 'cloud');
        this.add.image(1140, 70, 'cloud');
        this.add.image(1400, 90, 'cloud');
        this.add.image(1740, 30, 'cloud');
        this.add.image(1900, 60, 'cloud');

        // Plataformas principais
        this.ground = this.physics.add.staticGroup();
        this.ground.create(800, 760, 'ground');
        this.ground.create(2400, 760, 'ground');

        // Plataformas pequenas
        this.smplat = this.physics.add.staticGroup();
        this.smplat.create(350, 580, 'groundsm').setScale(0.3).refreshBody();

        this.smplatw = this.physics.add.staticGroup();
        this.smplatw.create(680, 430, 'groundsm').setScale(0.3).refreshBody();

        // Bambu
        this.food = this.physics.add.staticGroup();
        this.food.create(680, 480, 'bambu').setScale(0.25).refreshBody();
        this.food.create(1280, 580, 'bambu').setScale(0.25).refreshBody();
        this.food.create(1250, 70, 'bambu').setScale(0.25).refreshBody();


        // Grupos para lógica do jogo
        this.pass = this.physics.add.staticGroup();
        this.buttons = this.physics.add.staticGroup();
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

        // Score
        this.scoreText = this.add.text(16, 16, 'score: 0', {
            fontSize: '36px',
            fill: '#000',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });


        // Colisões e overlaps
        this.physics.add.collider(this.ground, this.player);
        this.physics.add.collider(this.smplat, this.player);
        this.physics.add.collider(this.smplatw, this.player, this.death, null, this).name = 'platf';
        this.physics.add.collider(this.player, this.doorsc2).name = 'doorcr';
        this.physics.add.overlap(this.player, this.food, this.collecta, null, this);
        this.physics.add.overlap(this.player, this.pass, this.last, null, this);
        this.physics.add.collider(this.player, this.doorso2, this.win, null, this);

        // Botão Voltar para o menu de níveis
        const btnVoltar = this.add.text(1850, 40, 'Voltar', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        })
        .setInteractive({ useHandCursor: true })
        .setDepth(10)
        .on('pointerover', () => btnVoltar.setStyle({ fill: '#f1c40f' }))
        .on('pointerout', () => btnVoltar.setStyle({ fill: '#fff' }))
        .on('pointerdown', () => {
            this.scene.stop(); 
            this.scene.stop('Nivel1');
            this.scene.start('LevelMenuScene');
        });
        

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
            this.smplat.create(1660, 380, 'ground').setScale(0.3).refreshBody();

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
            this.add.text(700, 450, 'Collect all bambus first', { fontSize: '36px', fill: '#fff' });
        }
    }

    death(player, smplatw) {
        // Cria ondas de água perigosas
        this.watwave2 = this.physics.add.staticGroup();
        this.watwave2.create(400, 745, 'watwave2').setScale(1.2).refreshBody();
        this.watwave2.create(1200, 745, 'watwave2').setScale(1.2).refreshBody();
        this.watwave2.create(2000, 745, 'watwave2').setScale(1.2).refreshBody();

        this.physics.add.collider(this.watwave2, this.player, this.drown, null, this);
        this.physics.add.collider(this.ground, this.watwave2, this.delpl, null, this);

        this.smplat.create(80, 250, 'ground').setScale(0.3).refreshBody();
        this.smplat.create(480, 150, 'ground').setScale(0.3).refreshBody();
        this.smplat.create(920, 290, 'ground').setScale(0.3).refreshBody();

        this.pass.create(1600, 480, 'pass2');
        this.smplat.create(1600, 520, 'groundsm').setScale(0.3).refreshBody();

        this.smplat.create(680, 430, 'groundsm').setScale(0.3).refreshBody();

        this.physics.world.colliders.remove(
            this.physics.world.colliders.getActive().find(i => i.name === 'platf')
        );

        this.physics.add.collider(this.smplat, this.player);
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
        this.smplat.create(1600, 670, 'ground').setScale(0.3).refreshBody();
        this.smplat.create(1800, 670, 'ground').setScale(0.3).refreshBody();
        this.smplat.create(2000, 670, 'ground').setScale(0.3).refreshBody();

        this.smplat.create(1900, 250, 'ground').setScale(0.).refreshBody();
        this.smplat.create(1280, 530, 'ground').setScale(0.3).refreshBody();

        this.doorsc2.create(1920, 130, 'doorc2').setScale(1.5).refreshBody();

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
