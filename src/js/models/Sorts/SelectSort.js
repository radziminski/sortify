import Sort from './Sort';
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class SelectSortView extends Sort {
    constructor(blockWidth, breakPointer, pausePointer) {
        super(blockWidth, breakPointer, pausePointer);
        this.sortStep = {
            currentStep: null, // start, highlighting, 
        };
    }

    instantSelectSort(sizes) {
        for (let i = 0; i < sizes.length - 1; i++) {
            let max = this.findMax(i, sizes);
            this.arrSwap(sizes, i, max);
        }

        blocksView.renderBlocks(sizes, this.blockWidth);
    }

    async nextIteration(currentBlock, sizes, waitTime, animated = true) {
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
                ifContinue = await this.highlightConsequtiveBlocks(currentBlock, sizes.length - 1, waitTime) :
                this.findMax(currentBlock, sizes);
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

    async sortIt(sizes, waitTime, animated = true) {
        this.stop();
        await this.delay();
        this.breakPointer = false;

        if (waitTime < 10) {
            this.instantSelectSort(sizes);
            settingsView.changeToPlayIcon();
            return;
        }

        if (waitTime < 80 && animated) {
            animated = false;
        }

        for (let i = 0; i < sizes.length - 1; i++) {
            // Coloring previous (already sorted) block:
            i > 0 ? blocksView.colorSingleBlock(i - 1, 'rgb(31, 111, 197)') : null;

            // Next iteration:
            if (await this.nextIteration(i, sizes, waitTime, animated)) continue;
            else {
                blocksView.colorAllBlocks(sizes.length);
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
    }




    // NOT FINISHED
    async selectSortContinue(sizes, waitTime, step) {
        for (let i = step; i < sizes.length - 1; i++) {
            // Coloring previous (already sorted) block:
            i > 0 ? blocksView.colorSingleBlock(i - 1, colors.sorted) : null;

            // Next iteration:
            if (await this.nextIteration(i, sizes, waitTime)) continue;
            else {
                blocksView.colorAllBlocks(sizes.length);
                return;
            }
        }
    }

    // NOT FINISHED!
    async firstIterationPaused(currentBlock, sizes, waitTime, step) {
        return new Promise(async (resolve, reject) => {
            const cont = false;

            // step: START
            if (step === 'START') {
                currentBlock === 0 ? null : await this.wait(waitTime).catch(() => {
                    err ? resolve('HIGHLITING') : resolve(err);
                    return;
                });
                let ifContinue = true;
                blocksView.colorSingleBlock(currentBlock, 'red');  
                cont = true;              
            }

            // step: HIGHLITING
            if (step === 'HIGHLITING' || cont) {
                const maxBlock = waitTime > 100 ? 
                ifContinue = await this.highlightConsequtiveBlocks(currentBlock, sizes.length - 1, waitTime) : 
                this.findMax(currentBlock, sizes);

                if (!ifContinue && ifContinue !== 0) {
                    resolve(null);
                    return;
                };

                cont = true;
            }
            
            if (step !== 'SWAPPED') {
                if (step !== 'IS MAX' || (cont === true && maxBlock !== currentBlock)) {
                    // step: FOUNDMAX
                    if (step )
                    await this.wait(waitTime).catch((err) => {
                        err ? resolve('BEFORE SWAP') : resolve(err);
                        return;
                    });
                    blocksView.colorSingleBlock(maxBlock, 'red');
                    this.arrSwap(sizes, currentBlock, maxBlock);
    
                    // step: BEFORE SWAP
                    await this.wait(waitTime).catch((err) => {
                        err ? resolve('DURING SWAP') : resolve(err);
                        return;
                    });
    
                    // step: DURING SWAP
                    ifContinue = await this.blocksSwapAnimation(currentBlock, maxBlock, waitTime);
                    if (!ifContinue) resolve(null);
                } else {
                    // step: IS MAX
                    await this.wait(waitTime / 3).catch((err) => {
                        err ? resolve('SWAPPED') : resolve(err);
                        return;
                    });
                    blocksView.colorSingleBlock(sizes.length - 1, colors.defalut);
                }
            }
            
            // step: SWAPPED
            await this.wait(waitTime).catch((err) => {
                err ? resolve('START') : resolve(err);
                return;
            });
            blocksView.clearTwoBlocksColors(currentBlock, maxBlock);
            resolve(true);
        })
    
    };

}

export default SelectSortView;


