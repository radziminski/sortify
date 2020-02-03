export default class Blocks {
    constructor(blocksNum, blockWidth, sizes = []) {
        this.blocksNum = blocksNum;
        this.blockWidth = blockWidth;
        this.sizes = sizes;
    }

    generateBlocks(minHeight, maxHeight) {
        this.clearSizes();
        for (let i = 0; i < this.blocksNum; i++) {
            let rand = Math.round((Math.random() * 1000) % (maxHeight - minHeight)) + minHeight;
            if (!rand) rand = minHeight;
            this.sizes.push(rand);
        };
    }

    blocksShuffle() {
        for (let i = this.sizes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.sizes[i], this.sizes[j]] = [this.sizes[j], this.sizes[i]];
        }
    }

    clearSizes() {
        this.sizes = [];
    }
}