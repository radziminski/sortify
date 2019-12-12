import Sort from "./Sort";
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class InsertSort extends Sort {
    constructor(blockWidth, breakPointer, pausePointer) {
        super(blockWidth, breakPointer, pausePointer);
    }

    instantSort(sizes, sortType) {
        for (let i = 1; i < sizes.length; i++) {
            let markedBlock = sizes[i];
            let k = i;
            while(((sizes[k - 1] > markedBlock && !sortType) ||
                (sizes[k - 1] < markedBlock && sortType)) &&
                (k >= 1)) {
                    sizes[k] = sizes[k - 1];
                    k--;
                }
            sizes[k] = markedBlock;
        }
    }

    async makeSteps(sizesOrig, waitTime, animated = true, sortType = true) {
        return new Promise(async (resolve, reject) => {
            this.stepsArr = [];
            this.stepsArr.push({
                stepNum: 'initial settings',
                blocksNum: sizesOrig.length,
            });
            const sizes = [...sizesOrig];

            for (let markedBlock = 1; markedBlock < sizes.length; markedBlock++) {
                const markedBlockHeight = sizes[markedBlock];

                if (markedBlock === 2) {
                    this.stepsArr.push({
                        stepNum: 1,
                            arg: {
                                blocks: [0, 1],
                                color: colors.sorted,
                            },
                    });
                }

                this.stepsArr.push({
                    stepNum: 1,
                        arg: {
                            blocks: [markedBlock],
                            color: colors.chosen,
                        },
                });

                this.stepsArr.push({
                    stepNum: 7,
                        arg: {
                            blocks: [markedBlock],
                            waitTime: waitTime,
                        },
                });
                this.stepsArr.push({
                    stepNum: 0,
                        arg: {
                            waitTime: waitTime,
                        },
                });
                let k = markedBlock;
                console.log(markedBlockHeight);
                console.log(sizes)
                while(((sizes[k - 1] > markedBlockHeight && !sortType) ||
                    (sizes[k - 1] < markedBlockHeight && sortType)) &&
                    (k >= 1)) {
                        sizes[k] = sizes[k - 1];
                        this.stepsArr.push({
                            stepNum: 5,
                                arg: {
                                    blocks: [k, k - 1],
                                    sizes: sizesOrig,
                                },
                        });
                        if (waitTime > 100) {
                            this.stepsArr.push({
                                stepNum: 3,
                                    arg: {
                                        blocks: [k, k - 1],
                                        waitTime: waitTime,
                                    },
                            });
                        } else {
                            this.stepsArr.push({
                                stepNum: 4,
                                    arg: {
                                        blocks: [k, k - 1],
                                    },
                            });
                        }
                        k--;
                }
                sizes[k] = markedBlockHeight;
                this.stepsArr.push({
                    stepNum: 1,
                        arg: {
                            blocks: [k],
                            color: colors.sorted,
                        },
                });
                this.stepsArr.push({
                    stepNum: 8,
                        arg: {
                            blocks: [k],
                            waitTime: waitTime,
                        },
                });

                
            }
            resolve();
        });
    }

    async stop(blocksNum = 0) {
        this.breakPointer = true;
        setTimeout(() => {
        blocksView.colorAllBlocks(blocksNum);
        blocksView.clearRaiseBlocks(blocksNum);
        this.currentStep = 1;
        }, 30);
        
    }
}

export default InsertSort;