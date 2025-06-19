class Nivel1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Nivel1' });
    }

    preload() {
        // Barra de progresso visual
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

        // Carrega todos os assets necessários
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
        this.load.spritesheet('startBtn', 'Assets/startBtn.png', { frameWidth: 60, frameHeight: 60 });
        this.load.audio('jump', 'Assets/jump4.mp3');
        this.load.audio('collect', 'Assets/collect.mp3');
        this.load.audio('gameov', 'Assets/gameov.mp3');
        this.load.image('doorc', 'Assets/doorc.png');
        this.load.image('dooro', 'Assets/dooro.png');
        this.load.audio('gateop', 'Assets/gateop.mp3');
        this.load.audio('intenseMusic', 'Assets/Intense.mp3');
    }

    create() {
        this.score = 0;
        this.gameOver = false;

        // Fundo e elementos visuais principais
        this.add.tileSprite(0, 0, 2000, 800, 'background').setOrigin(0).setDepth(0);
        this.sun = this.add.sprite(1450, 160, 'sol').setScale(0.6).setDepth(1);

        // Nuvens móveis (atrás da pontuação)
        this.clouds = [
            [0, 80], [300, 100], [580, 160], [880, 100], [1150, 200], [1450, 100], [1800, 80]
        ].map(([x, y]) => this.add.sprite(x, y, 'nuvem').setScale(0.6).setDepth(1));

        // Jogador principal
        this.player = this.physics.add.sprite(50, 640, 'pandapx').setBounce(0.2).setCollideWorldBounds(true);

        // Grupos de física para plataformas, lava, bambus, portas, etc.
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

        // Criação das plataformas e objetos fixos
        this.platforms.create(-300, 760, 'ground');
        this.platforms.create(1500, 760, 'ground');
        this.platformsm1.create(1200, 580, 'groundsm').setScale(0.3).refreshBody();
        this.lavas1.create(600, 780, 'lava').setScale(0.3).refreshBody();
        this.stones.create(300, 693, 'stone');

        // Bambus colecionáveis com animação de flutuação
        this.bambuList = [ [300, 550], [600, 500], [1200, 640], [1700, 500], [1200, 400] ]
            .map(([x, y], i) => {
                const bambu = this.bamboos.create(x, y, 'bambu').setScale(0.25).refreshBody();
                this.tweens.add({
                    targets: bambu,
                    y: bambu.y - 10,
                    duration: 1200 + i * 120,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                return bambu;
            });

        // Controles e pontuação 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(16, 16, 'pontuação: 0', {
            fontSize: '36px', fill: '#000', fontStyle: 'bold', fontFamily: 'Arial'
        }).setDepth(10);

        // Animações do jogador
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNumbers('pandapx', { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'turn', frames: [{ key: 'pandapx', frame: 4 }], frameRate: 20 });
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNumbers('pandapx', { start: 5, end: 7 }), frameRate: 10, repeat: -1 });

        // Colisões e interações principais
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.stones, this.player);
        this.physics.add.collider(this.platformsm1, this.player, this.platf3, null, this).name = 'splat1';
        this.physics.add.collider(this.platformsm3, this.player);
        this.physics.add.collider(this.platformsm4, this.player);
        this.physics.add.overlap(this.player, this.bamboos, this.collectfood, null, this);
        this.physics.add.collider(this.player, this.lavas1, this.burn, null, this);
        this.physics.add.collider(this.player, this.lavas2, this.burn, null, this);
        this.physics.add.overlap(this.platforms, this.lavas2, this.plrem, null, this);
        this.physics.add.overlap(this.stones, this.lavas2, this.strem, null, this);
        this.physics.add.overlap(this.player, this.keys, this.lavacreate, null, this);
        this.physics.add.collider(this.platforms, this.doorsc);
        this.physics.add.collider(this.player, this.doorsc).name = 'doclose';
        this.physics.add.collider(this.platforms, this.doorso);
        this.physics.add.collider(this.player, this.doorso, this.win, null, this);

        // Botão voltar ao menu de níveis
        const btnVoltar = this.add.text(30, 60, '⬅ VOLTAR', {
            fontSize: '32px', fill: '#00ccff', fontFamily: 'Arial', fontStyle: 'bold', backgroundColor: '#00000088',
            padding: { left: 12, right: 12, top: 6, bottom: 6 }
        })
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setInteractive({ useHandCursor: true })
            .setDepth(10)
            .on('pointerover', () => btnVoltar.setColor('#ffffff'))
            .on('pointerout', () => btnVoltar.setColor('#00ccff'))
            .on('pointerdown', () => {
                if (this.intenseMusic && this.intenseMusic.isPlaying) this.intenseMusic.stop();
                this.scene.start('LevelMenuScene');
            });

        // Música ambiente do nível
        if (!this.intenseMusic || !this.intenseMusic.isPlaying) {
            this.intenseMusic = this.sound.add('intenseMusic', { loop: true, volume: 0.5 });
            this.intenseMusic.play();
        }
        this.events.on('transitionstart', (fromScene, toScene) => {
            if (['LevelMenuScene', 'MainMenuScene', 'DefinicoesScene'].includes(toScene.key) && this.intenseMusic) {
                this.intenseMusic.stop();
            }
        });

        // Ajuste responsivo do canvas
        window.addEventListener('resize', () => this.resizeGame());
        this.resizeGame();
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

        // Movimento das nuvens (loop horizontal) e rotação do sol
        this.clouds.forEach(cloud => {
            cloud.x += 0.3;
            if (cloud.x > this.cameras.main.width + 100) cloud.x = -100;
        });
        this.sun.angle += 0.06;
    }

    // Função chamada ao apanhar um bambu
    collectfood(player, bambu) {
        bambu.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('pontuação: ' + this.score);
        this.sound.play('collect');
    }

    // Lógica de plataformas pequenas extra
    platf3() {
        this.platformsm4.create(1200, 580, 'groundsm').setScale(0.3).refreshBody();
        this.physics.world.colliders.remove(this.physics.world.colliders.getActive().find(i => i.name === 'splat1'));
        const platformsm2 = this.physics.add.staticGroup().create(830, 430, 'groundsm').setScale(0.3).refreshBody();
        this.physics.add.collider(platformsm2, this.player, this.showkey, null, this).name = 'plat';
    }

    // Lógica de game over por lava
    burn(player, lava) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn', false);
        this.gameOver = true;
        if (this.intenseMusic) this.intenseMusic.stop();
        this.add.image(940, 350, 'gameover');
        this.sound.play('gameov');
        this.startBtn = this.add.sprite(940, 500, 'startBtn').setInteractive();
        this.startBtn.once('pointerdown', () => this.replay());
    }

    // Mostra chave e plataformas extra
    showkey(player, groundsm) {
        this.keys.create(580, 250, 'pass');
        this.platforms.create(2328, 760, 'ground');
        this.lavas2.create(230, 800, 'lava2').setScale(1.0).refreshBody();
        this.lavas2.create(810, 800, 'lava2').setScale(1.0).refreshBody();
        this.lavas2.create(1184, 800, 'lava2').setScale(1.0).refreshBody();
        this.platformsm3.create(829, 430, 'groundsm').setScale(0.3).refreshBody();
        this.physics.world.colliders.remove(this.physics.world.colliders.getActive().find(i => i.name === 'plat'));
        this.doorsc.create(1880, 600, 'doorc').setScale(1.5).refreshBody();
    }

    // Remove plataforma ao tocar na lava
    plrem(ground, lava) {
        ground.disableBody(true, true);
    }

    // Remove pedra ao tocar na lava
    strem(stone, lava) {
        stone.disableBody(true, true);
    }

    // Lógica ao apanhar a chave
    lavacreate(player, pass) {
        pass.disableBody(true, true);
        this.score += 20;
        this.scoreText.setText('pontuação: ' + this.score);

        if (this.score === 70) {
            this.sound.play('collect');
            this.doorso.create(1880, 600, 'dooro').setScale(1.5).refreshBody();
            this.sound.play('gateop');
            this.physics.world.colliders.remove(this.physics.world.colliders.getActive().find(i => i.name === 'doclose'));
        } else {
            // Game over se não apanhares todos os bambus
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn', false);
            this.gameOver = true;
            if (this.intenseMusic) this.intenseMusic.stop();
            this.add.image(940, 350, 'gameover');
            this.add.text(620, 450, 'Apanha todos os bambus primeiro', { fontSize: '36px', fill: '#000' });
            this.sound.play('gameov');
            this.startBtn = this.add.sprite(940, 550, 'startBtn').setInteractive();
            this.startBtn.once('pointerdown', () => this.replay());
        }
    }

    // Vitória do nível
    win() {
        this.physics.pause();
        this.player.setTint(0x008000);
        this.player.anims.play('turn');
        this.gameOver = true;
        if (this.intenseMusic) this.intenseMusic.stop();
        this.add.image(1000, 400, 'win').setDepth(10);
        this.time.delayedCall(2000, () => this.scene.start('LevelMenuScene'));
    }

    // Reinicia o nível ao clicar em repetir
    replay() {
        if (this.startBtn) {
            this.startBtn.destroy();
            this.startBtn = null;
        }
        this.scene.restart();
    }

    // Redimensiona o canvas para manter o aspeto responsivo
    resizeGame() {
        const canvas = this.sys.game.canvas;
        const windowWidth = window.innerWidth, windowHeight = window.innerHeight;
        const windowRatio = windowWidth / windowHeight, gameRatio = this.sys.game.config.width / this.sys.game.config.height;
        if (windowRatio < gameRatio) {
            canvas.style.width = windowWidth + 'px';
            canvas.style.height = (windowWidth / gameRatio) + 'px';
        } else {
            canvas.style.width = (windowHeight * gameRatio) + 'px';
            canvas.style.height = windowHeight + 'px';
        }
    }
}

window.Nivel1 = Nivel1;
