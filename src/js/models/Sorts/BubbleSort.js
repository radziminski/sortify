import Sort from "./Sort";
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';



class BubbleSort extends Sort {
    getType() {
        return 'bubbleSort';
    }

    instantSort(sizes, sortType) {
        let n = sizes.length;
        let ifAnySwapped;
        let comparisons = 0;
        while (n > 1) {
            ifAnySwapped = false;
            for (let i = 0; i < n - 1; i++) {

                if (sizes[i] < sizes[i + 1] && sortType ||
                    sizes[i] > sizes[i + 1] && !sortType) {
                    this.arrSwap(sizes, i, i + 1);
                    ifAnySwapped = true;
                }
                comparisons++;
            }
            if (!ifAnySwapped) break;
        }

        return (comparisons);
    }

    // STEPS MAKER
    makeSteps(sizesOrig, waitTime, sortType = true) {
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
                
                this.addStep('colorBlocks', {
                        color: colors.current,
                        blocks: [i, i+1],
                });
                
                this.addStep('wait', {waitTime});
                this.addStep('updtComparisons', {});

                if (sortType && sizes[i] < sizes[i + 1] ||
                    !sortType && sizes[i] > sizes[i + 1]) {
                        
                    if (waitTime > 100) {
                        this.addStep('colorBlocks', {
                                color: colors.chosen,
                                blocks: [i, i+1],
                        });
                        this.addStep('wait', {waitTime});
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


                    ifAnySwapped = true;
                }

                this.addStep('colorBlocks', {
                        color: colors.default,
                        blocks: [i, i + 1]
                });
            }
            if (!ifAnySwapped) break;

            n--;
        }
    }

}

export default BubbleSort;

