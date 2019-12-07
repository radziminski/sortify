import Sort from './Sort';
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class SelectSortView extends Sort {
    constructor(blockWidth, breakPointer, pausePointer) {
        super(blockWidth, breakPointer, pausePointer);
        this.sortStep = 0;
    }

    instantSelectSort(sizes, sortType) {
        for (let i = 0; i < sizes.length - 1; i++) {
            let max = sortType ? this.findMax(i, sizes) : this.findMin(i, sizes);
            max != i ? this.arrSwap(sizes, i, max) : null;
        }

        blocksView.renderBlocks(sizes, this.blockWidth);
    }

    async nextIteration(currentBlock, sizes, waitTime, animated = true, sortType) {
        return new Promise(async (resolve, reject) => {
            if (currentBlock !== 0) 
                await this.wait(waitTime)
                .catch(() => {
                    resolve(null);
                    return;
                });
            let ifContinue = true;
            blocksView.colorSingleBlock(currentBlock, 'red');

            
            const maxBlock = waitTime > 200 && animated ? 
                ifContinue = await this.highlightConsequtiveBlocks(currentBlock, sizes.length - 1, waitTime, sortType) :
                sortType ? this.findMax(currentBlock, sizes) : this.findMin(currentBlock, sizes);
            
            if (!ifContinue && (ifContinue !== 0)) {
                resolve(null);
                return;
            };
            
            if (maxBlock !== currentBlock) {
                await this.wait(waitTime).catch((err) => {
                    resolve(err);
                    return;
                });

                blocksView.colorSingleBlock(maxBlock, 'red');
                this.arrSwap(sizes, currentBlock, maxBlock);

                await this.wait(waitTime).catch((err) => {
                    resolve(err);
                    return;
                });

                if (animated) {
                    await this.blocksSwapAnimation(currentBlock, maxBlock, waitTime).catch(err => {
                        resolve(null);
                        return;
                    });
                } else {
                    blocksView.swapBlocksColors(currentBlock, maxBlock);
                    blocksView.swapBlocksHeight(currentBlock, maxBlock);
                }
                
            } else {
                await this.wait(waitTime / 3).catch((err) => {
                    resolve(err);
                    return;
                });

                blocksView.colorSingleBlock(sizes.length - 1, colors.defalut);
            }
            
            await this.wait(waitTime).catch((err) => {
                resolve(err);
                return;
            });

            blocksView.clearTwoBlocksColors(currentBlock, maxBlock);
            resolve(true);
        })
    
    };

    async sortIt(sizes, waitTime, animated = true, sortType = true) {
        this.breakPointer = true;
        await this.delay();
        this.breakPointer = false;

        if (waitTime < 10) {
            this.instantSelectSort(sizes, sortType);
            settingsView.changeToPlayIcon();
            return;
        }

        if (waitTime < 80 && animated) {
            animated = false;
        }

        for (let i = this.sortStep; i < sizes.length - 1; i++) {
            // Coloring previous (already sorted) block:
            i > 0 ? blocksView.colorSingleBlock(i - 1, 'rgb(31, 111, 197)') : null;
            this.sortStep = i;
            // Next iteration:
            if (await this.nextIteration(i, sizes, waitTime, animated, sortType)) continue;
            else {
                return;
            }
            
        }
        

        // Blocks are sorted!

        // Coloring last blocks:
        blocksView.colorSingleBlock(sizes.length - 1, 'rgba(0,135,255,1)');
        blocksView.colorSingleBlock(sizes.length - 2, 'rgba(0,135,255,1)');
        await this.wait(waitTime);

        // Adding green highlight to inform that array is sorted:
        blocksView.colorAllBlocks(sizes.length);
        waitTime > 300 ? await this.wait(waitTime) : await this.wait(250);
        blocksView.colorAllBlocks(sizes.length, 'rgba(0,173,68,1)');
        waitTime > 300 ? await this.wait(waitTime) : await this.wait(400);
        blocksView.colorAllBlocks(sizes.length);

        settingsView.changeToPlayIcon();
        this.sortStep = 0;
    }


}

export default SelectSortView;


