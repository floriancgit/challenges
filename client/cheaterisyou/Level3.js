class Level3 extends GameMap {
    constructor(...params) {
        super(3, ...params);
    }

    hitFinish() {
        const request = new XMLHttpRequest();
        request.open("GET", "/epreuves/javascript/cheaterisyou/api/level3.php?" + this.keyParam + "finish&coins=" + encodeURIComponent(this.coins.filter(c => c.picked).length), true);
        request.addEventListener("readystatechange", () => {
            if (request.readyState === XMLHttpRequest.DONE) {
                const data = JSON.parse(request.responseText);
                if (request.status === 200 && data.hasOwnProperty("success")) {
                    if (data.success) {
                        this.sfx["win"].currentTime = 0;
                        this.sfx["win"].play();
                        this.onFinish(data.key);
                    } else if (data.error === "coins") {
                        this.message = "Missing coins";
                    } else {
                        this.message = "???";
                    }
                } else if (request.status === 403) {
                    const errorData = JSON.parse(request.responseText);
                    alert("Access denied : " + errorData.error);
                } else {
                    alert("Une erreur est survenue : merci de contacter un administrateur si cela se reproduit systèmatiquement et sans action de votre part.")
                }
            }
        });
        request.send();
    }
}