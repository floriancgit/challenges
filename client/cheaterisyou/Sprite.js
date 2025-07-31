class Sprite {
    constructor(id) {
        this.load(id);
        this.imageSet = [];
        this.imageStates = {};
    }

    load(id) {
        this.img = document.getElementById(id);
    }

    addImage(x, y, width, height) {
        this.imageSet.push({
            x: x,
            y: y,
            width: width,
            height: height
        })
    }

    addState(name, ...indexes) {
        this.imageStates[name] = indexes;
    }

    hasState(state) {
        return this.imageStates.hasOwnProperty(state);
    }

    getImage(stateName, frame) {
        const state = this.imageStates[stateName];
        const image = this.imageSet[state[frame % state.length]];
        return {
            img: this.img,
            ...image
        }
    }
}