class GameMap {
    constructor(index, name, width, height, spriteSet, sfx) {
        this.index = index;
        this.name = name;
        this.spriteSet = spriteSet;
        this.sfx = sfx;
        this.started = false;
        this.showCoinHud = true;
        this.width = width;
        this.height = height;
        this.walls = [];
        this.coins = [];
        this.finish = {};
        this.player = {};
        this.message = "";
        for (let y = 0; y < height; y++) {
            let line = [];
            for (let x = 0; x < width; x++) {
                line.push(0);
            }
            this.walls.push(line);
        }
        this.onFinish = () => {};
        this.sfx["start"].play();
    }

    reload() {
        this.started = false;
        this.coins = [];
        this.message = "";
        this.loadData(this.rawData);
        this.sfx["start"].currentTime = 0;
        this.sfx["start"].play();
    }

    loadData(data) {
        this.rawData = data;
        if (data.hasOwnProperty("walls")) {
            this.setWalls(data.walls);
        }
        if (data.hasOwnProperty("start")) {
            this.setPlayer(data.start.x, data.start.y);
        }
        if (data.hasOwnProperty("end")) {
            this.setFinish(data.end.x, data.end.y);
        }
        if (data.hasOwnProperty("coins")) {
            for (let coin of data.coins) {
                this.addCoin(coin.x, coin.y);
            }
        }
    }

    setWalls(newWalls) {
        this.walls = newWalls;
    }

    setFinish(x, y) {
        this.finish = {x: x, y: y};
    }

    addCoin(x, y) {
        this.coins.push({x: x, y: y, picked: false});
    }

    setPlayer(x, y) {
        this.player = {x: x, y: y, state: "idle"};
    }

    start() {
        this.started = true;
    }

    movePlayer(direction) {
        if (this.canMove(direction)) {
            switch (direction) {
                case 'u': this.player.y--; this.player.state = "up"; break;
                case 'd': this.player.y++; this.player.state = "down"; break;
                case 'l': this.player.x--; this.player.state = "left"; break;
                case 'r': this.player.x++; this.player.state = "right"; break;
            }
            if (this.coins.some(c => !c.picked && c.x === this.player.x && c.y === this.player.y)) {
                this.pickupCoin(this.player.x, this.player.y);
            } else if (this.player.x === this.finish.x && this.player.y === this.finish.y) {
                this.hitFinish();
            } else {
                this.sfx["move"].currentTime = 0;
                this.sfx["move"].play();
            }
            return true;
        }
        return false;
    }

    canMove(direction) {
        switch (direction) {
            case 'u': if (this.player.y <= 0 || this.walls[this.player.y - 1][this.player.x] > 0) return false; break;
            case 'd': if (this.player.y >= this.height - 1 || this.walls[this.player.y + 1][this.player.x] > 0) return false; break;
            case 'l': if (this.player.x <= 0 || this.walls[this.player.y][this.player.x - 1] > 0) return false; break;
            case 'r': if (this.player.x >= this.width - 1 || this.walls[this.player.y][this.player.x + 1] > 0) return false; break;
        }
        return true;
    }

    pickupCoin(x, y) {
        this.sfx["coin"].currentTime = 0;
        this.sfx["coin"].play();
        this.coins = this.coins.map(c => c.x === x && c.y === y ? {x: c.x, y: c.y, picked:true} : c);
    }

    hitFinish() {

    }

    writeText(ctx, currentFrame, x, y, text) {
        text = text.toLowerCase();
        for (let i in text) {
            if (this.spriteSet["charset"].hasState(text[i])) {
                const char = this.spriteSet["charset"].getImage(text[i], currentFrame);
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

    show(ctx, currentFrame) {
        if (this.started) {
            // Background
            ctx.fillStyle = "rgb(62, 87, 111)";
            ctx.fillRect(0, 0, this.width * 24, this.height * 24);
            // Walls
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    if (this.walls[y][x] === 1) {
                        let contacts = {"v": 0, "h": 0};
                        if (y === 0 || this.walls[y - 1][x] === 1) {
                            contacts["v"] |= 0x1;
                        }
                        if (y === this.height - 1 || this.walls[y + 1][x] === 1) {
                            contacts["v"] |= 0x2;
                        }
                        if (x === 0 || this.walls[y][x - 1] === 1) {
                            contacts["h"] |= 0x1;
                        }
                        if (x === this.width - 1 || this.walls[y][x + 1] === 1) {
                            contacts["h"] |= 0x2;
                        }
                        let state = "";
                        if (contacts["v"] === 0x0) {
                            state += "none";
                        } else if (contacts["v"] === 0x1) {
                            state += "up";
                        } else if (contacts["v"] === 0x2) {
                            state += "bottom";
                        } else if (contacts["v"] === 0x3) {
                            state += "both";
                        }
                        state += "_";
                        if (contacts["h"] === 0x0) {
                            state += "none";
                        } else if (contacts["h"] === 0x1) {
                            state += "left";
                        } else if (contacts["h"] === 0x2) {
                            state += "right";
                        } else if (contacts["h"] === 0x3) {
                            state += "both";
                        }
                        const wall = this.spriteSet["wall"].getImage(state, currentFrame);
                        ctx.drawImage(
                            wall.img,
                            wall.x, wall.y,
                            wall.width, wall.height,
                            24 * x, 24 * y,
                            24, 24
                        );
                    } else if (this.walls[y][x] === 2) {
                        const fence = this.spriteSet["fence"].getImage("all", currentFrame);
                        ctx.drawImage(
                            fence.img,
                            fence.x, fence.y,
                            fence.width, fence.height,
                            24 * x, 24 * y,
                            24, 24
                        );
                    }
                }
            }
            // Coins
            const coin = this.spriteSet["coin"].getImage("idle", currentFrame);
            for (let {x, y} of this.coins.filter(c => !c.picked)) {
                ctx.drawImage(
                    coin.img,
                    coin.x, coin.y,
                    coin.width, coin.height,
                    24 * x, 24 * y,
                    24, 24
                );
            }
            // Finish
            if (Object.keys(this.finish)) {
                const finish = this.spriteSet["finish"].getImage("idle", currentFrame);
                ctx.drawImage(
                    finish.img,
                    finish.x, finish.y,
                    finish.width, finish.height,
                    24 * this.finish.x, 24 * this.finish.y,
                    24, 24
                );
            }
            // Player
            const player = this.spriteSet["player"].getImage(this.player.state, currentFrame);
            ctx.drawImage(
                player.img,
                player.x, player.y,
                player.width, player.height,
                24 * this.player.x, 24 * this.player.y,
                24, 24
            );
            // HUD
            if (this.showCoinHud) {
                ctx.drawImage(coin.img, coin.x, coin.y, coin.width, coin.height, 0, 24 * (this.height - 1), 24, 24);
                this.writeText(ctx, currentFrame, 24, 24 * (this.height - 1), "- " + this.coins.filter(c => c.picked).length + "/" + this.coins.length);
            }
            this.writeText(ctx, currentFrame, Math.floor(24 * this.width / 2 - 6 * this.message.length), 0, this.message);
        } else {
            // Entry screen
            ctx.fillStyle = "rgb(93, 68, 156)";
            ctx.fillRect(0, 0, this.width * 24, this.height * 24);
            this.writeText(
                ctx, currentFrame,
                Math.floor(24 * this.width / 2 - 6 * this.index.toString().length - 36), Math.floor(24 * this.height / 2 - 24),
                "Level " + this.index
            );
            this.writeText(
                ctx, currentFrame,
                Math.floor(24 * this.width / 2 - 6 * this.name.length), Math.floor(24 * this.height / 2),
                this.name
            );
        }
    }
}