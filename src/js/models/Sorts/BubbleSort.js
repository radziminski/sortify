import Sort from "./Sort";
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';
class BubbleSort extends Sort {
    constructor(blockWidth, breakPointer, pausePointer) {
        super(blockWidth, breakPointer, pausePointer);
    }

    instantBubbleSort(sizes) {
        let n = sizes.length;
        let ifAnySwapped;
        while (n > 1) {
            ifAnySwapped = false;
            for (let i = 0; i < n - 1; i++) {
                if (sizes[i] < sizes[i + 1]) {
                    this.arrSwap(sizes, i, i + 1);
                    ifAnySwapped = true;
                }
            }
            if (!ifAnySwapped) break;
        }
        blocksView.renderBlocks(sizes, this.blockWidth, false);
    }

    async sortIt(sizes, waitTime, animated = true) {
        // Stopping ongoing sorting and starting new
        this.stop();
        await this.delay();
        this.breakPointer = false;

        if (waitTime <= 10) {
            this.instantBubbleSort(sizes);
            settingsView.changeToPlayIcon();
            return;
        }

        // Flag that will check If any promise didnt thorw error - if sort should not stop
        let contionueFlag = true;

        let n = sizes.length;
        while (n > 1) {
            let ifAnySwapped = false;
            // n !== sizes.length ? blocksView.colorSingleBlock(n , 'rgb(31, 111, 197)') : null;
            for (let i = 0; i < n - 1; i++) {
                if ((n !== sizes.length || i !== 0) && waitTime > 100) await this.wait(waitTime).catch(err => {
                    contionueFlag = false;
                });
                if (!contionueFlag) break;

                blocksView.colorSeveralBlocks('red', i, i + 1);
                await this.wait(waitTime).catch(err => {
                    contionueFlag = false;
                });
                if (!contionueFlag) break;

                if (sizes[i] < sizes[i + 1]) {
                    if (waitTime > 100) {
                        blocksView.colorSeveralBlocks(colors.chosen, i, i + 1);
                        await this.wait(waitTime).catch(err => {
                            contionueFlag = false;
                        });
                        if (!contionueFlag) break;
                    }

                    if (waitTime > 100) {
                        await this.blocksSwapAnimation(i, i + 1, waitTime).catch(() => {
                            contionueFlag = false;
                        });
                    } else {
                        // blocksView.swapBlocksColors(i, i + 1);
                        blocksView.swapBlocksHeight(i, i + 1);
                    }
                        
                    if (!contionueFlag) break;

                    this.arrSwap(sizes, i, i + 1);

                    await this.wait(waitTime).catch(err => {
                        contionueFlag = false;
                    });;
                    if (!contionueFlag) break;

                    ifAnySwapped = true;
                }

                blocksView.clearTwoBlocksColors(i, i + 1);
            }

            if (!contionueFlag) {
                blocksView.colorAllBlocks(sizes.length);
                return;
            }
            if (!ifAnySwapped) break;

            n--;
        }

        // Adding green highlight to inform that array is sorted:
        blocksView.colorAllBlocks(sizes.length);
        waitTime > 300 ? await this.wait(waitTime) : await this.wait(250);
        blocksView.colorAllBlocks(sizes.length, 'rgba(0,173,68,1)');
        waitTime > 300 ? await this.wait(waitTime) : await this.wait(400);
        blocksView.colorAllBlocks(sizes.length);

        settingsView.changeToPlayIcon();
      
    }
}

export default BubbleSort;