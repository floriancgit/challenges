class Level1 extends GameMap {
    constructor(...params) {
        super(1, ...params);
    }

    hitFinish() {
        if (this.coins.every(c => c.picked)) {
            const request = new XMLHttpRequest();
            request.open("GET", "/epreuves/javascript/cheaterisyou/api/level1.php?finish", true);
            request.addEventListener("readystatechange", () => {
                if (request.readyState === XMLHttpRequest.DONE) {
                    const data = JSON.parse(request.responseText);
                    if (request.status === 200 && data.hasOwnProperty("success")) {
                        this.sfx["win"].currentTime = 0;
                        this.sfx["win"].play();
                        this.onFinish(data.key);
                    } else {
                        alert("Une erreur est survenue : merci de contacter un administrateur si cela se reproduit systèmatiquement et sans action de votre part.")
                    }
                }
            });
            request.send();
        } else {
            this.message = "Missing coins";
        }
    }
}