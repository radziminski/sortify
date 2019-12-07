import Sort from './Sort';
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class SelectSortView extends Sort {
    constructor(blockWidth, breakPointer, pausePointer) {
        super(blockWidth, breakPointer, pausePointer);
    }

    instantSelectSort(sizes, sortType) {
        for (let i = 0; i < sizes.length - 1; i++) {
            let max = sortType ? this.findMax(i, sizes) : this.findMin(i, sizes);
            max != i ? this.arrSwap(sizes, i, max) : null;
        }

        blocksView.renderBlocks(sizes, this.blockWidth);
    }

    async makeSteps(sizesOrig, waitTime, animated = true, sortType = true) {
        return new Promise(async (resolve, reject) => {
            this.stepsArr = [];
            this.stepsArr.push({
                stepNum: 'initial settings',
                blocksNum: sizesOrig.length,
            });
            const sizes = [...sizesOrig];

            for (let currentBlock = 0; currentBlock < sizes.length; currentBlock++) {
                // coloring already sorted previous block
                currentBlock > 0 ?
                    this.stepsArr.push({
                        stepNum: 1,
                        arg: {
                            color: colors.sorted,
                            blocks: [currentBlock - 1],
                        },
                    }) : null;
                
                // wait if not in first iteration
                if (currentBlock !== 0) 
                    this.stepsArr.push({
                        stepNum: 0,
                        arg: {
                            waitTime: waitTime,
                        },
                    });

                // highliting current block
                this.stepsArr.push({
                    stepNum: 1,
                    arg: {
                        color: 'red',
                        blocks: [currentBlock],
                    },
                });
                this.stepsArr.push({
                    stepNum: 0,
                    arg: {
                        waitTime: waitTime,
                    },
                });

                // finding curent max / min block
                const maxBlock = sortType ? this.findMax(currentBlock, sizes) : this.findMin(currentBlock, sizes);
                
                // displaying searching procedure as sequence of coloring 
                if (waitTime > 100 && animated) {
                    let max = currentBlock;
                    for (let nextBlock = currentBlock + 1; nextBlock < sizesOrig.length; nextBlock++) {

                        // coloring block that we are currently investigating for being max / min
                        this.stepsArr.push({
                            stepNum: 1,
                            arg: {
                                color: colors.highlight,
                                blocks: [nextBlock],
                            },
                        });
                        this.stepsArr.push({
                            stepNum: 0,
                            arg: {
                                waitTime: waitTime,
                            },
                        });

                        // checking if it is bigger / smaller than previous max / min
                        if (sizes[nextBlock] > sizes[max] && sortType ||
                            sizes[nextBlock] < sizes[max] && !sortType) {
                                // if yes coloring it and clearing previous max
                                if (max !== currentBlock) {
                                    this.stepsArr.push({
                                        stepNum: 1,
                                        arg: {
                                            color: colors.default,
                                            blocks: [max],
                                        },
                                    });
                                }

                                this.stepsArr.push({
                                    stepNum: 1,
                                    arg: {
                                        color: colors.chosen,
                                        blocks: [nextBlock],
                                    },
                                });
                                
                                // and updating current max / min
                                max = nextBlock;
                                this.stepsArr.push({
                                    stepNum: 0,
                                    arg: {
                                        waitTime: waitTime,
                                    },
                                });
                        } else {
                            // if not clearing hgighlight
                            this.stepsArr.push({
                                stepNum: 1,
                                arg: {
                                    color: colors.default,
                                    blocks: [nextBlock],
                                },
                            });
                        }
                    }
                }
                
                // if max is not current block we need to do swap and swap animation
                if (maxBlock !== currentBlock) {
                    this.stepsArr.push({
                        stepNum: 0,
                        arg: {
                            waitTime: waitTime,
                        },
                    });

                    // highliting found max / min block
                    this.stepsArr.push({
                        stepNum: 1,
                        arg: {
                            color: 'red',
                            blocks: [maxBlock],
                        },
                    });

                    // swapping future array values 
                    this.stepsArr.push({
                        stepNum: 5,
                        arg: {
                            sizes: sizesOrig,
                            blocks: [currentBlock, maxBlock],
                        },
                    });

                    // swapping current array values 
                    this.arrSwap(sizes, currentBlock, maxBlock);

                    this.stepsArr.push({
                        stepNum: 0,
                        arg: {
                            waitTime: waitTime,
                        },
                    });

                    // displaying or not blocks switch animation and switching their properties
                    if (animated) {
                        this.stepsArr.push({
                            stepNum: 3,
                            arg: {
                                blocks: [currentBlock, maxBlock,],
                                waitTime: waitTime,
                            },
                        });
                    } else {
                        this.stepsArr.push({
                            stepNum: 6,
                            arg: {
                                blocks: [currentBlock, maxBlock,],
                            },
                        });
                        this.stepsArr.push({
                            stepNum: 4,
                            arg: {
                                blocks: [currentBlock, maxBlock,],
                            },
                        });
                    }
                    
                } else {
                    // if curreent block is max then we just move to next one
                    this.stepsArr.push({
                        stepNum: 0,
                        arg: {
                            waitTime: waitTime / 3,
                        },
                    });

                    //???
                    this.stepsArr.push({
                        stepNum: 1,
                        arg: {
                            color: colors.default,
                            blocks: [sizesOrig.length - 1],
                        },
                    });
                }
                
                this.stepsArr.push({
                    stepNum: 0,
                    arg: {
                        waitTime: waitTime,
                    },
                });

                // clearing colors
                this.stepsArr.push({
                    stepNum: 1,
                    arg: {
                        color: colors.default,
                        blocks: [currentBlock, maxBlock],
                    },
                });
            }

            // coloring last blocks as sorted
            this.stepsArr.push({
                stepNum: 1,
                arg: {
                    color: colors.sorted,
                    blocks: [sizes.length - 1, sizes.length - 2],
                },
            });

            this.stepsArr.push({
                stepNum: 0,
                arg: {
                    waitTime: waitTime,
                },
            });
        });
    
    };

}

export default SelectSortView;


// old sorting methods

// async sortIt(sizes, waitTime, animated = true, sortType = true) {
//     this.breakPointer = true;
//     await this.delay();
//     this.breakPointer = false;

//     if (waitTime < 10) {
//         this.instantSelectSort(sizes, sortType);
//         settingsView.changeToPlayIcon();
//         return;
//     }

//     if (waitTime < 80 && animated) {
//         animated = false;
//     }

//     for (let i = this.sortStep; i < sizes.length - 1; i++) {
//         // Coloring previous (already sorted) block:
//         i > 0 ? blocksView.colorSingleBlock(i - 1, 'rgb(31, 111, 197)') : null;
//         this.sortStep = i;
//         // Next iteration:
//         if (await this.nextIteration(i, sizes, waitTime, animated, sortType)) continue;
//         else {
//             return;
//         }
        
//     }
    

//     // Blocks are sorted!

//     // Coloring last blocks:
//     blocksView.colorSingleBlock(sizes.length - 1, 'rgba(0,135,255,1)');
//     blocksView.colorSingleBlock(sizes.length - 2, 'rgba(0,135,255,1)');
//     await this.wait(waitTime);

//     // Adding green highlight to inform that array is sorted:
//     blocksView.colorAllBlocks(sizes.length);
//     waitTime > 300 ? await this.wait(waitTime) : await this.wait(250);
//     blocksView.colorAllBlocks(sizes.length, 'rgba(0,173,68,1)');
//     waitTime > 300 ? await this.wait(waitTime) : await this.wait(400);
//     blocksView.colorAllBlocks(sizes.length);

//     settingsView.changeToPlayIcon();
//     this.sortStep = 0;
// }






// async nextIteration(currentBlock, sizes, waitTime, animated = true, sortType) {
//     return new Promise(async (resolve, reject) => {
//         if (currentBlock !== 0) 
//             await this.wait(waitTime)
//             .catch(() => {
//                 resolve(null);
//                 return;
//             });
//         let ifContinue = true;
//         blocksView.colorSingleBlock(currentBlock, 'red');

        
//         const maxBlock = waitTime > 200 && animated ? 
//             ifContinue = await this.highlightConsequtiveBlocks(currentBlock, sizes.length - 1, waitTime, sortType) :
//             sortType ? this.findMax(currentBlock, sizes) : this.findMin(currentBlock, sizes);
        
//         if (!ifContinue && (ifContinue !== 0)) {
//             resolve(null);
//             return;
//         };
        
//         if (maxBlock !== currentBlock) {
//             await this.wait(waitTime).catch((err) => {
//                 resolve(err);
//                 return;
//             });

//             blocksView.colorSingleBlock(maxBlock, 'red');
//             this.arrSwap(sizes, currentBlock, maxBlock);

//             await this.wait(waitTime).catch((err) => {
//                 resolve(err);
//                 return;
//             });

//             if (animated) {
//                 await this.blocksSwapAnimation(currentBlock, maxBlock, waitTime).catch(err => {
//                     resolve(null);
//                     return;
//                 });
//             } else {
//                 blocksView.swapBlocksColors(currentBlock, maxBlock);
//                 blocksView.swapBlocksHeight(currentBlock, maxBlock);
//             }
            
//         } else {
//             await this.wait(waitTime / 3).catch((err) => {
//                 resolve(err);
//                 return;
//             });

//             blocksView.colorSingleBlock(sizes.length - 1, colors.defalut);
//         }
        
//         await this.wait(waitTime).catch((err) => {
//             resolve(err);
//             return;
//         });

//         blocksView.clearTwoBlocksColors(currentBlock, maxBlock);
//         resolve(true);
//     })

// };