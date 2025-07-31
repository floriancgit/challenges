let level;

document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
        const canvas = document.getElementById('game');
        if (canvas.getContext) {
            const ctx = canvas.getContext('2d');

            // Sprites - Wall
            const wall_sprites = new Sprite("sprites");
            for (let x = 0; x < 16; x++) {
                for (let y = 0; y < 3; y++) {
                    wall_sprites.addImage(24 * x, 24 * y, 24, 24);
                }
            }
            wall_sprites.addState("none_none", 0, 1, 2);
            wall_sprites.addState("none_right", 3, 4, 5);
            wall_sprites.addState("up_none", 6, 7, 8);
            wall_sprites.addState("up_right", 9, 10, 11);
            wall_sprites.addState("none_left", 12, 13, 14);
            wall_sprites.addState("none_both", 15, 16, 17);
            wall_sprites.addState("up_left", 18, 19, 20);
            wall_sprites.addState("up_both", 21, 22, 23);
            wall_sprites.addState("bottom_none", 24, 25, 26);
            wall_sprites.addState("bottom_right", 27, 28, 29);
            wall_sprites.addState("both_none", 30, 31, 32);
            wall_sprites.addState("both_right", 33, 34, 35);
            wall_sprites.addState("bottom_left", 36, 37, 38);
            wall_sprites.addState("bottom_both", 39, 40, 41);
            wall_sprites.addState("both_left", 42, 43, 44);
            wall_sprites.addState("both_both", 45, 46, 47);
            // Sprites - Fence
            const fence_sprites = new Sprite("sprites");
            for (let x = 8; x < 12; x++) {
                fence_sprites.addImage(24 * x, 24 * 3, 24, 24);
            }
            fence_sprites.addState("all", 0, 1, 2, 3);
            // Sprites - Coin
            const coin_sprites = new Sprite("sprites");
            for (let x = 0; x < 4; x++) {
                coin_sprites.addImage(24 * x, 24 * 3, 24, 24);
            }
            coin_sprites.addState("idle", 0, 1, 2, 3);
            // Sprites - Finish
            const finish_sprites = new Sprite("sprites");
            for (let x = 4; x < 8; x++) {
                finish_sprites.addImage(24 * x, 24 * 3, 24, 24);
            }
            finish_sprites.addState("idle", 0, 1, 2, 3);
            // Sprites - Player
            const player_sprites = new Sprite("sprites");
            for (let x = 0; x < 5; x++) {
                for (let y = 4; y < 7; y++) {
                    player_sprites.addImage(24 * x, 24 * y, 24, 24);
                }
            }
            player_sprites.addState("idle", 0, 1, 2);
            player_sprites.addState("right", 3, 4, 5);
            player_sprites.addState("left", 6, 7, 8);
            player_sprites.addState("up", 9, 10, 11);
            player_sprites.addState("down", 12, 13, 14);
            // Sprites - Charset
            const charset_sprites = new Sprite("sprites");
            const charset = "abcdefghijklmnopqrstuvwxyz0123456789-/.?!{}";
            for (let i = 0; i < charset.length; i++) {
                for (let y = 7; y < 14; y += 3) {
                    charset_sprites.addImage(24 * (i % 16), 24 * (Math.floor(i / 16) + y), 24, 24);
                }
            }
            for (let i in charset) {
                charset_sprites.addState(charset[i], 3 * i, 3 * i + 1, 3 * i + 2);
            }
            // Sprite set
            const sprites = {
                "wall": wall_sprites,
                "fence": fence_sprites,
                "coin": coin_sprites,
                "finish": finish_sprites,
                "player": player_sprites,
                "charset": charset_sprites
            };
            // Sfx
            const sfx = {
                "start": new Audio("/epreuves/javascript/cheaterisyou/ressources/restart.wav"),
                "coin": new Audio("/epreuves/javascript/cheaterisyou/ressources/coin.wav"),
                "move": new Audio("/epreuves/javascript/cheaterisyou/ressources/move.wav"),
                "win": new Audio("/epreuves/javascript/cheaterisyou/ressources/win.wav"),
            };
            for (let k in sfx) {
                sfx[k].volume = 0.25;
            }

            // FPS
            let currentFrame = 0;
            setInterval(() => {
                currentFrame++;
            }, 150);

            let isKeyDown = false;
            window.addEventListener("keydown", (ev) => {
                if (!isKeyDown) {
                    isKeyDown = true;
                    if (level) {
                        if (!level.started) {
                            level.start();
                        } else {
                            if (ev.key.startsWith("Arrow")) {
                                ev.preventDefault();
                                level.movePlayer(ev.key[5].toLowerCase());
                            } else if (ev.key.toLowerCase() === "r") {
                                level.reload();
                            }
                        }
                    }
                }
            });

            window.addEventListener("keyup", (ev) => {
                isKeyDown = false;
            });

            let reward = "";
            const finishLevel1 = (key) => {
                level = null;
                loadLevel(2, Level2, finishLevel2, key);
            };
            const finishLevel2 = (key) => {
                level = null;
                loadLevel(3, Level3, finishLevel3, key);
            };
            const finishLevel3 = (key) => {
                level = null;
                loadLevel(4, Level4, finishLevel4, key);
            };
            const finishLevel4 = (key) => {
                level = null;
                loadLevel(5, Level5, finishLevel5, key);
            };
            const finishLevel5 = (key) => {
                level = null;
                loadLevel(6, Level6, finishLevel6, key);
            };
            const finishLevel6 = (key) => {
                level = null;
                loadLevel(7, Level7, finishLevel7, key);
            };
            const finishLevel7 = (key) => {
                level = null;
                loadLevel(8, Level8, finishLevel8, key);
            };
            const finishLevel8 = (key) => {
                level = null;
                loadLevel(9, Level9, finishLevel9, key);
            };
            const finishLevel9 = (key) => {
                level = null;
                loadLevel(10, Level10, finishLevel10, key);
            };
            const finishLevel10 = (key) => {
                level = null;
                reward = key;
            };

            loadLevel(1, Level1, finishLevel1);

            requestAnimationFrame(loop);

            function loadLevel(index, MapObject, onFinish, key) {
                const request = new XMLHttpRequest();
                let keyParam = "";
                if (key) {
                    keyParam = "key=" + encodeURIComponent(key) + "&";
                }
                request.open("GET", "/epreuves/javascript/cheaterisyou/api/level" + index + ".php?" + keyParam + "init", true);
                request.addEventListener("readystatechange", () => {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            const levelData = JSON.parse(request.responseText);
                            level = new MapObject(levelData.name, levelData.size.width, levelData.size.height, sprites, sfx);
                            level.loadData(levelData);
                            level.onFinish = onFinish;
                            if (key) {
                                level.keyParam = keyParam;
                            }
                        } else if (request.status === 403) {
                            const errorData = JSON.parse(request.responseText);
                            alert("Access denied : " + errorData.error);
                        } else {
                            alert("Une erreur est survenue : merci de contacter un administrateur si cela se reproduit systèmatiquement sans action de votre part sur le code.")
                        }
                    }
                });
                request.send();
            }

            function writeText(ctx, currentFrame, x, y, text) {
                text = text.toLowerCase();
                for (let i in text) {
                    if (charset_sprites.hasState(text[i])) {
                        const char = charset_sprites.getImage(text[i], currentFrame);
                        ctx.drawImage(
                            char.img,
                            char.x, char.y,
                            char.width, char.height,
                            x + 12 * i, y,
                            24, 24
                        );
                    }
                }
            }

            function loop() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (reward.length > 0) {
                    ctx.fillStyle = "rgb(104, 212, 58)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    writeText(ctx, currentFrame, Math.floor(canvas.width / 2 - 90), Math.floor((canvas.height - 4 * 48) / 2), "Felicitations !");
                    writeText(ctx, currentFrame, Math.floor(canvas.width / 2 - 192), Math.floor((canvas.height - 3 * 48) / 2), "Vous avez fini ce jeu impossible");
                    writeText(ctx, currentFrame, Math.floor(canvas.width / 2 - 204), Math.floor((canvas.height - 2 * 48) / 2), "Voici le mot de passe pour valider");
                    writeText(ctx, currentFrame, Math.floor(canvas.width / 2 - 6 * reward.length), Math.floor((canvas.height + 48) / 2), reward);
                } else if (level) {
                    level.show(ctx, currentFrame);
                } else {
                    ctx.fillStyle = "rgb(181, 102, 59)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    writeText(ctx, currentFrame, Math.floor(canvas.width / 2 - 60), Math.floor(canvas.height / 2 - 12), "Loading...");
                }
                requestAnimationFrame(loop);
            }
        } else {
            alert("Erreur : impossible de lancer le jeu...");
        }
    }
});