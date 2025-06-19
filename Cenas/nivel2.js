class Nivel2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel2' });
    }

    preload() {
        // Barra de progresso visual enquanto carrega os assets
        const width = this.cameras.main.width, height = this.cameras.main.height;
        const progressBox = this.add.graphics(), progressBar = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8).fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        const loadingText = this.make.text({ x: width / 2, y: height / 2 - 50, text: 'Loading...', style: { font: '20px monospace', fill: '#fff' } }).setOrigin(0.5);
        const percentText = this.make.text({ x: width / 2, y: height / 2 - 5, text: '0%', style: { font: '18px monospace', fill: '#fff' } }).setOrigin(0.5);

        this.load.on('progress', value => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear().fillStyle(0xffffff, 1).fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });
        this.load.on('complete', () => {
            progressBar.destroy(); progressBox.destroy(); loadingText.destroy(); percentText.destroy();
        });

        // Carrega todos os assets necessários para o nível
        this.load.image('back', 'Assets/background2.jpg');
        this.load.image('watwave2', 'Assets/lava2.png');
        this.load.image('cloud2', 'Assets/cloud2.png');
        this.load.image('watwave', 'Assets/watwave.png');
        this.load.image('rain2', 'Assets/rain2.png');
        this.load.image('ground', 'Assets/ground.png');
        this.load.image('groundsm', 'Assets/groundsm.png');
        this.load.image('win2', 'Assets/win.png');
        this.load.image('bambu', 'Assets/bambu.png');
        this.load.image('pass2', 'Assets/pass.png');
        this.load.image('button2', 'Assets/button2.png');
        this.load.image('doorc2', 'Assets/doorc.png');
        this.load.image('dooro2', 'Assets/dooro.png');
        this.load.image('gameover2', 'Assets/gameover.png');
        this.load.spritesheet('pandapx2', 'Assets/pandapx.png', { frameWidth: 70, frameHeight: 100 });
        this.load.spritesheet('startBtn', 'Assets/startBtn.png', { frameWidth: 60, frameHeight: 60 });
        this.load.audio('jump', 'Assets/jump4.mp3');
        this.load.audio('collect', 'Assets/collect.mp3');
        this.load.audio('gameov', 'Assets/gameov.mp3');
        this.load.audio('gateop', 'Assets/gateop.mp3');
        this.load.audio('buttsound', 'Assets/buttsound.mp3');
        this.load.image('stone', 'Assets/stone.png');
        this.load.image('win', 'Assets/win.png');
        this.load.audio('intenseMusic', 'Assets/Intense.mp3');
    }

    create() {
        this.score = 0;
        this.gameOver = false;

        // Fundo e chuva decorativa
        this.add.image(0, 0, 'back').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        this.add.image(100, 460, 'rain2');
        this.add.image(800, 480, 'rain2');
        this.add.image(1540, 480, 'rain2');
        this.add.image(2000, 450, 'rain2');

        // Nuvens móveis 
        this.clouds = [
            this.add.image(50, 80, 'cloud2').setDepth(1),
            this.add.image(350, 60, 'cloud2').setDepth(1),
            this.add.image(700, 100, 'cloud2').setDepth(1),
            this.add.image(800, 70, 'cloud2').setDepth(1),
            this.add.image(1140, 70, 'cloud2').setDepth(1),
            this.add.image(1400, 90, 'cloud2').setDepth(1),
            this.add.image(1740, 30, 'cloud2').setDepth(1),
            this.add.image(1900, 60, 'cloud2').setDepth(1)
        ];

        // Plataformas e objetos de jogo
        this.ground = this.physics.add.staticGroup();
        this.ground.create(800, 760, 'ground');
        this.ground.create(2400, 760, 'ground');
        this.smplat = this.physics.add.staticGroup();
        this.smplat.create(350, 580, 'groundsm').setScale(0.3).refreshBody();
        this.smplatw = this.physics.add.staticGroup();
        this.smplatw.create(680, 430, 'groundsm').setScale(0.3).refreshBody();
        this.stones = this.physics.add.staticGroup();

        // Bambus colecionáveis com animação de flutuação
        this.food = this.physics.add.staticGroup();
        this.bambuList = [
            this.food.create(680, 490, 'bambu').setScale(0.25).refreshBody(),
            this.food.create(1280, 580, 'bambu').setScale(0.25).refreshBody(),
            this.food.create(1250, 70, 'bambu').setScale(0.25).refreshBody()
        ];
        this.bambuList.forEach((bambu, i) => {
            this.tweens.add({
                targets: bambu,
                y: bambu.y - 10,
                duration: 1200 + i * 120,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Grupos lógicos para chaves, botões e portas
        this.pass = this.physics.add.staticGroup();
        this.buttons = this.physics.add.staticGroup();
        this.doorsc2 = this.physics.add.staticGroup();
        this.doorso2 = this.physics.add.staticGroup();

        // Jogador e animações
        this.player = this.physics.add.sprite(50, 640, 'pandapx2').setBounce(0.2).setCollideWorldBounds(true);
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('pandapx2', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'turn', frames: [{ key: 'pandapx2', frame: 4 }], frameRate: 20 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('pandapx2', { start: 5, end: 7 }), frameRate: 10, repeat: -1 });

        // Input e pontuação (scoreText fica sempre à frente das nuvens)
        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(16, 16, 'pontuação: 0', {
            fontSize: '36px', fill: '#000', fontStyle: 'bold', fontFamily: 'Arial'
        }).setDepth(10);

        // Colisões e overlaps principais
        this.physics.add.collider(this.ground, this.player);
        this.physics.add.collider(this.smplat, this.player);
        this.physics.add.collider(this.smplatw, this.player, this.death, null, this).name = 'platf';
        this.physics.add.collider(this.player, this.doorsc2).name = 'doorcr';
        this.physics.add.collider(this.player, this.buttons, this.showall, null, this).name = 'butt';
        this.physics.add.overlap(this.player, this.food, this.collecta, null, this);
        this.physics.add.overlap(this.player, this.pass, this.last, null, this);
        this.physics.add.collider(this.player, this.doorso2, this.win, null, this);
        this.physics.add.collider(this.stones, this.player);

        // Botão Voltar
        const btnVoltar = this.add.text(30, 60, '⬅ VOLTAR', {
            fontSize: '32px', fill: '#00ccff', fontFamily: 'Arial', fontStyle: 'bold',
            backgroundColor: '#00000088', padding: { left: 12, right: 12, top: 6, bottom: 6 }
        })
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .setDepth(10)
            .on('pointerover', () => btnVoltar.setColor('#ffffff'))
            .on('pointerout', () => btnVoltar.setColor('#00ccff'))
            .on('pointerdown', () => {
                if (this.intenseMusic) this.intenseMusic.stop();
                this.scene.start('LevelMenuScene');
            });

        // Música ambiente do nível
        this.intenseMusic = this.sound.add('intenseMusic', { loop: true, volume: 0.5 });
        this.intenseMusic.play();
        this.events.on('transitionstart', (fromScene, toScene) => {
            if (['LevelMenuScene', 'MainMenuScene', 'DefinicoesScene'].includes(toScene.key) && this.intenseMusic) {
                this.intenseMusic.stop();
            }
        });
    }

    update() {
        if (this.gameOver) return;

        // Movimento do jogador
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

        // Movimento contínuo das nuvens (loop)
        this.clouds.forEach(cloud => {
            cloud.x += 0.18;
            if (cloud.x > this.cameras.main.width + 100) cloud.x = -100;
        });
    }

    // Coleta bambu e atualiza pontuação
    collecta(player, food) {
        food.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('pontuação: ' + this.score);
        this.sound.play('collect');
    }

    // Lógica ao apanhar a chave
    last(player, pass) {
        pass.disableBody(true, true);
        this.score += 20;
        this.scoreText.setText('pontuação: ' + this.score);

        if (this.score === 50) {
            this.doorso2.create(1920, 130, 'dooro2').setScale(1.5).refreshBody();
            this.sound.play('gateop');
            this.physics.world.colliders.remove(
                this.physics.world.colliders.getActive().find(i => i.name === 'doorcr')
            );
            this.sound.play('collect');
        } else {
            // Game over se não apanhares todos os bambus
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.player.anims.play('turn', false);
            this.gameOver = true;
            this.sound.play('gameov');
            this.add.image(940, 350, 'gameover2');
            this.add.text(625, 450, 'Apanha todos os bambus primeiro', { fontSize: '36px', fill: '#fff' });
            if (this.intenseMusic && this.intenseMusic.isPlaying) this.intenseMusic.stop();
            if (this.startBtn) this.startBtn.destroy();
            this.startBtn = this.add.sprite(940, 550, 'startBtn').setInteractive();
            this.startBtn.once('pointerdown', () => this.replay());
        }
    }

    // Reinicia o nível ao clicar em repetir
    replay() {
        if (this.startBtn) { this.startBtn.destroy(); this.startBtn = null; }
        this.scene.restart();
    }

    // Lógica de morte por água e plataformas extra
    death(player, smplatw) {
        this.watwave2 = this.physics.add.staticGroup();
        this.watwave2.create(400, 745, 'watwave').setScale(1.2).refreshBody();
        this.watwave2.create(1200, 745, 'watwave').setScale(1.2).refreshBody();
        this.watwave2.create(2000, 745, 'watwave').setScale(1.2).refreshBody();

        this.physics.add.collider(this.watwave2, this.player, this.drown, null, this);
        this.physics.add.collider(this.ground, this.watwave2, this.delpl, null, this);

        this.smplat.create(80, 250, 'groundsm').setScale(0.3).refreshBody();
        this.smplat.create(480, 150, 'groundsm').setScale(0.3).refreshBody();
        this.smplat.create(920, 290, 'groundsm').setScale(0.3).refreshBody();

        // Chave animada
        this.chave = this.pass.create(1470, 300, 'pass2');
        this.tweens.add({
            targets: this.chave,
            y: this.chave.y - 15,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.buttons.create(60, 235, 'button2').setScale(1).refreshBody();
        this.smplat.create(680, 430, 'groundsm').setScale(0.3).refreshBody();

        this.physics.world.colliders.remove(
            this.physics.world.colliders.getActive().find(i => i.name === 'platf')
        );
        this.physics.add.collider(this.smplat, this.player);
    }

    // Game over por afogamento
    drown() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn', false);
        this.gameOver = true;
        this.sound.play('gameov');
        this.add.image(940, 350, 'gameover2');
        if (this.intenseMusic && this.intenseMusic.isPlaying) this.intenseMusic.stop();
        this.startBtn = this.add.sprite(940, 500, 'startBtn').setInteractive();
        this.startBtn.once('pointerdown', () => this.replay());
    }

    // Mostra plataformas e portas extra ao pressionar botão
    showall() {
        this.sound.play('buttsound');
        this.smplat.create(1900, 250, 'groundsm').setScale(0.3).refreshBody();
        this.smplat.create(1280, 530, 'groundsm').setScale(0.3).refreshBody();
        this.doorsc2.create(1920, 130, 'doorc2').setScale(1.5).refreshBody();
        this.buttons2 = this.physics.add.staticGroup();
        this.buttons2.create(60, 235, 'button2').setScale(1).refreshBody();
        this.physics.add.collider(this.player, this.buttons2);
        this.physics.world.colliders.remove(
            this.physics.world.colliders.getActive().find(i => i.name === 'butt')
        );
        this.smplat.create(1700, 358, 'groundsm').setScale(0.3).refreshBody();
        this.stones.create(1375, 506, 'stone').setScale(0.6).refreshBody();
    }

    // Vitória do nível
    win() {
        this.physics.pause();
        this.player.setTint(0x008000);
        this.player.anims.play('turn');
        this.gameOver = true;
        this.add.image(1000, 400, 'win').setDepth(10);
        this.time.delayedCall(2000, () => {
            if (this.intenseMusic) this.intenseMusic.stop();
            this.scene.start('LevelMenuScene');
        });
    }
}

window.Nivel2 = Nivel2;
