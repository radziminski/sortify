import Sort from "./Sort";
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';



class BubbleSort extends Sort {
    constructor(blockWidth, breakPointer) {
        super(blockWidth, breakPointer);
        this.stepsArr = [];
    }

    instantSort(sizes, sortType) {
        let n = sizes.length;
        let ifAnySwapped;
        while (n > 1) {
            ifAnySwapped = false;
            for (let i = 0; i < n - 1; i++) {

                if (sizes[i] < sizes[i + 1] && sortType ||
                    sizes[i] > sizes[i + 1] && !sortType) {
                    this.arrSwap(sizes, i, i + 1);
                    ifAnySwapped = true;
                }
            }
            if (!ifAnySwapped) break;
        }
        blocksView.renderBlocks(sizes, this.blockWidth, false);
    }

    // STEPS MAKER
    async makeSteps(sizesOrig, waitTime, animated = true, sortType = true) {
        this.stepsArr = [];
        this.stepsArr.push({
            stepNum: 'initial settings',
            blocksNum: sizesOrig.length,
        });
        const sizes = [...sizesOrig];
        let n = sizes.length;

        while (n > 1) {
            let ifAnySwapped = false;
            // n !== sizes.length ? blocksView.colorSingleBlock(n , 'rgb(31, 111, 197)') : null;
            for (let i = 0; i < n - 1; i++) {
                if ((n !== sizes.length || i !== 0) && waitTime > 100) this.stepsArr.push({
                    stepNum: 0,
                    arg: {
                        waitTime: waitTime,
                    },
                })
                
                this.stepsArr.push({
                    stepNum: 1,
                    arg: {
                        color: 'red',
                        blocks: [i, i+1],
                    },
                });
                
                this.stepsArr.push({
                    stepNum: 0,
                    arg: {
                        waitTime: waitTime,
                    },
                });

                if (sortType && sizes[i] < sizes[i + 1] ||
                    !sortType && sizes[i] > sizes[i + 1]) {
                        console.log('true')
                    if (waitTime > 100) {
                        this.stepsArr.push({
                            stepNum: 1,
                            arg: {
                                color: colors.chosen,
                                blocks: [i, i+1],
                            },
                        })
                        this.stepsArr.push({
                            stepNum: 0,
                            arg: {
                                waitTime: waitTime,
                            },
                        });
                    }

                    if (waitTime > 100) {
                        this.stepsArr.push({
                            stepNum: 3,
                            arg: {
                                waitTime: waitTime,
                                blocks: [i, i + 1]
                            },
                        });
                    } else {
                        // blocksView.swapBlocksColors(i, i + 1);
                        this.stepsArr.push({
                            stepNum: 4,
                            arg: {
                                blocks: [i, i + 1]
                            },
                        });
                    }

                    this.stepsArr.push({
                        stepNum: 5,
                        arg: {
                            sizes: sizesOrig,
                            blocks: [i, i + 1]
                        },
                    });

                    this.arrSwap(sizes, i, i + 1);

                    this.stepsArr.push({
                        stepNum: 0,
                        arg: {
                        },
                    });

                    ifAnySwapped = true;
                }

                this.stepsArr.push({
                    stepNum: 1,
                    arg: {
                        color: colors.default,
                        blocks: [i, i + 1]
                    },
                });
            }
            if (!ifAnySwapped) break;

            n--;
        }
    }

}

export default BubbleSort;




    // old sorting function
    // async sortIt(sizes, waitTime, animated = true, sortType = true) {
    //     // Stopping ongoing sorting and starting new
    //     this.stop();
    //     await this.delay();
    //     this.breakPointer = false;

    //     if (waitTime < 10) {
    //         this.instantBubbleSort(sizes, sortType);
    //         settingsView.changeToPlayIcon();
    //         return;
    //     }

    //     // Flag that will check If any promise didnt thorw error - if sort should not stop
    //     let contionueFlag = true;

    //     let n = sizes.length;
    //     while (n > 1) {
    //         let ifAnySwapped = false;
    //         // n !== sizes.length ? blocksView.colorSingleBlock(n , 'rgb(31, 111, 197)') : null;
    //         for (let i = 0; i < n - 1; i++) {
    //             if ((n !== sizes.length || i !== 0) && waitTime > 100) await this.wait(waitTime).catch(err => {
    //                 contionueFlag = false;
    //             });
    //             if (!contionueFlag) break;

    //             blocksView.colorSeveralBlocks('red', i, i + 1);
    //             await this.wait(waitTime).catch(err => {
    //                 contionueFlag = false;
    //             });
    //             if (!contionueFlag) break;

    //             if (sortType && sizes[i] < sizes[i + 1] ||
    //                 !sortType && sizes[i] > sizes[i + 1]) {
    //                 if (waitTime > 100) {
    //                     blocksView.colorSeveralBlocks(colors.chosen, i, i + 1);
    //                     await this.wait(waitTime).catch(err => {
    //                         contionueFlag = false;
    //                     });
    //                     if (!contionueFlag) break;
    //                 }

    //                 if (waitTime > 100) {
    //                     await this.blocksSwapAnimation(i, i + 1, waitTime).catch(() => {
    //                         contionueFlag = false;
    //                     });
    //                 } else {
    //                     // blocksView.swapBlocksColors(i, i + 1);
    //                     blocksView.swapBlocksHeight(i, i + 1);
    //                 }
                        
    //                 if (!contionueFlag) break;

    //                 this.arrSwap(sizes, i, i + 1);

    //                 await this.wait(waitTime).catch(err => {
    //                     contionueFlag = false;
    //                 });;
    //                 if (!contionueFlag) break;

    //                 ifAnySwapped = true;
    //             }

    //             blocksView.clearTwoBlocksColors(i, i + 1);
    //         }

    //         if (!contionueFlag) {
    //             blocksView.colorAllBlocks(sizes.length);
    //             return;
    //         }
    //         if (!ifAnySwapped) break;

    //         n--;
    //     }

    //     // Adding green highlight to inform that array is sorted:
    //     blocksView.colorAllBlocks(sizes.length);
    //     waitTime > 300 ? await this.wait(waitTime) : await this.wait(250);
    //     blocksView.colorAllBlocks(sizes.length, 'rgba(0,173,68,1)');
    //     waitTime > 300 ? await this.wait(waitTime) : await this.wait(400);
    //     blocksView.colorAllBlocks(sizes.length);

    //     settingsView.changeToPlayIcon();
      
    // }