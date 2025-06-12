class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });
        this.score = 0;
        this.gameOver = false;
    }

    preload() {
        // Loading bar
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
        }).setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: { font: '18px monospace', fill: '#ffffff' }
        }).setOrigin(0.5, 0.5);

        this.load.on('progress', value => {
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

        // Assets
        this.load.image('background', 'Assets/background.png');
        this.load.image('ground', 'Assets/ground.png');
        this.load.image('sol', 'Assets/sol.png');
        this.load.image('nuvem', 'Assets/nuvem.png');
        this.load.image('stone', 'Assets/stone.png');
        this.load.image('bambu', 'Assets/bambu.png');
        this.load.image('pass', 'Assets/pass.png');
        this.load.image('lava', 'Assets/lava.png');
        this.load.image('lava2', 'Assets/lava2.png');
        this.load.image('gameover', 'Assets/gameover.png');
        this.load.image('groundsm', 'Assets/groundsm.png');
        this.load.image('win', 'Assets/win.png');
        this.load.spritesheet('pandapx', 'Assets/pandapx.png', { frameWidth: 70, frameHeight: 100 });
        this.load.spritesheet('startBtn', 'panda/level2/startBtn.png', { frameWidth: 60, frameHeight: 60 });
        this.load.audio('jump', 'Assets/jump4.mp3');
        this.load.audio('collect', 'Assets/collect.mp3');
        this.load.audio('gameov', 'Assets/gameov.mp3');
        this.load.image('doorc', 'Assets/doorc.png');
        this.load.image('dooro', 'Assets/dooro.png');
        this.load.audio('gateop', 'Assets/gateop.mp3');
    }

    create() {
        // Background
        this.background = this.add.tileSprite(0, 0, 2000, 800, 'background')
        .setOrigin(0)
        .setDepth(0);
        this.add.image(1400, 160, 'sol').setScale(0.6);

        // Nuvens
        const nuvemPos = [
            [0, 80], [200, 140], [300, 100], [550, 180],
            [780, 120], [900, 140], [1150, 200], [1800, 80]
        ];
        nuvemPos.forEach(([x, y]) =>
        this.add.image(x, y, 'nuvem').setScale(0.6)
        );

        // Player
        this.player = this.physics.add.sprite(50, 640, 'pandapx');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Groups
        this.platforms = this.physics.add.staticGroup();
        this.platformsm1 = this.physics.add.staticGroup();
        this.platformsm3 = this.physics.add.staticGroup();
        this.platformsm4 = this.physics.add.staticGroup();
        this.lavas1 = this.physics.add.staticGroup();
        this.lavas2 = this.physics.add.staticGroup();
        this.stones = this.physics.add.staticGroup();
        this.bamboos = this.physics.add.staticGroup();
        this.keys = this.physics.add.staticGroup();
        this.doorsc = this.physics.add.staticGroup();
        this.doorso = this.physics.add.staticGroup();

        // Main platforms
        this.platforms.create(-300, 760, 'ground');
        this.platforms.create(1500, 760, 'ground');

        // Small platforms
        this.platformsm1.create(1200, 580, 'groundsm').setScale(0.3).refreshBody();

        // Lava (reduzida)
        this.lavas1.create(600, 780, 'lava').setScale(0.3).refreshBody();

        // Stones
        this.stones.create(300, 693, 'stone');

        // Bambu (reduzido)
        this.bamboos.create(300, 550, 'bambu').setScale(0.3).refreshBody();
        this.bamboos.create(600, 500, 'bambu').setScale(0.3).refreshBody();
        this.bamboos.create(1200, 640, 'bambu').setScale(0.3).refreshBody();
        this.bamboos.create(1700, 500, 'bambu').setScale(0.3).refreshBody();
        this.bamboos.create(1200, 400, 'bambu').setScale(0.3).refreshBody();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Score
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '36px', fill: '#000' });

        // Animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('pandapx', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'pandapx', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('pandapx', { start: 5, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // Colliders & Overlaps
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.stones, this.player);
        this.physics.add.collider(this.platformsm1, this.player, this.platf3, null, this).name = 'splat1';
        this.physics.add.collider(this.platformsm3, this.player);
        this.physics.add.collider(this.platformsm4, this.player);

        // CORRETO: Só overlap entre player e bambu!
        this.physics.add.overlap(this.player, this.bamboos, this.collectfood, null, this);

        // Lava é obstáculo, só collider!
        this.physics.add.collider(this.player, this.lavas1, this.burn, null, this);
        this.physics.add.collider(this.player, this.lavas2, this.burn, null, this);

        this.physics.add.overlap(this.platforms, this.lavas2, this.plrem, null, this);
        this.physics.add.overlap(this.stones, this.lavas2, this.strem, null, this);
        this.physics.add.overlap(this.player, this.keys, this.lavacreate, null, this);
        this.physics.add.collider(this.platforms, this.doorsc);
        this.physics.add.collider(this.player, this.doorsc).name = 'doclose';
        this.physics.add.collider(this.platforms, this.doorso);
        this.physics.add.collider(this.player, this.doorso, this.win, null, this);

        // Responsive resize
        window.addEventListener('resize', () => this.resizeGame());
        this.resizeGame();

        //Botão de voltar
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

    collectfood(player, bambu) {
        bambu.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('score: ' + this.score);
        this.sound.play('collect');
    }

    platf3() {
        this.platformsm4.create(1200, 580, 'groundsm').setScale(0.3).refreshBody();
        this.physics.world.colliders.remove(
            this.physics.world.colliders.getActive().find(i => i.name === 'splat1')
        );

        const platformsm2 = this.physics.add.staticGroup();
        platformsm2.create(830, 430, 'groundsm').setScale(0.3).refreshBody();
        this.physics.add.collider(platformsm2, this.player, this.showkey, null, this).name = 'plat';
    }

    burn(player, lava) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn', false);
        this.gameOver = true;
        this.add.image(940, 350, 'gameover');
        this.sound.play('gameov');

        this.startBtn = this.add.sprite(940, 500, 'startBtn').setInteractive();
        this.startBtn.on('pointerdown', () => this.replay());
    }

    showkey(player, groundsm) {
        this.keys.create(580, 250, 'pass');
        this.platforms.create(2328, 760, 'ground');
        this.lavas2.create(220, 790, 'lava2').setScale(1.5).refreshBody();
        this.lavas2.create(800, 790, 'lava2').setScale(1.5).refreshBody();
        this.lavas2.create(1172, 790, 'lava2').setScale(1.5).refreshBody();
        this.platformsm3.create(830, 430, 'groundsm').setScale(0.3).refreshBody();
        this.physics.world.colliders.remove(
            this.physics.world.colliders.getActive().find(i => i.name === 'plat')
        );
        this.doorsc.create(1880, 600, 'doorc').setScale(1.5).refreshBody();
    }

    plrem(ground, lava) {
        ground.disableBody(true, true);
    }

    strem(stone, lava) {
        stone.disableBody(true, true);
    }

    lavacreate(player, pass) {
        pass.disableBody(true, true);
        this.score += 20;
        this.scoreText.setText('score:' + this.score);

        if (this.score === 70) {
            this.sound.play('collect');
            this.doorso.create(1880, 600, 'dooro').setScale(1.5).refreshBody();
            this.sound.play('gateop');
            this.physics.world.colliders.remove(
                this.physics.world.colliders.getActive().find(i => i.name === 'doclose')
            );
        } else {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn', false);
            this.gameOver = true;
            this.add.image(940, 350, 'gameover');
            this.add.text(700, 450, 'Collect all bambus first', { fontSize: '36px', fill: '#000' });
            this.sound.play('gameov');
            this.startBtn = this.add.sprite(940, 550, 'startBtn').setInteractive();
            this.startBtn.on('pointerdown', () => this.replay());
        }
    }

    win() {
        this.physics.pause();
        this.player.setTint(0x008000);
        this.player.anims.play('turn');
        this.gameOver = true;
        // Troca para o próximo nível
        this.scene.start('Nivel2');
    }

    replay() {
        this.scene.restart();
    }

    resizeGame() {
        const canvas = this.sys.game.canvas;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const windowRatio = windowWidth / windowHeight;
        const gameRatio = this.sys.game.config.width / this.sys.game.config.height;

        if (windowRatio < gameRatio) {
            canvas.style.width = windowWidth + "px";
            canvas.style.height = (windowWidth / gameRatio) + "px";
        } else {
            canvas.style.width = (windowHeight * gameRatio) + "px";
            canvas.style.height = windowHeight + "px";
        }
    }
}

// Exporta a classe para ser usada no jogo principal
window.Nivel1 = Nivel1;
