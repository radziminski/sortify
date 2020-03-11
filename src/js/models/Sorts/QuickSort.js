import Sort from './Sort';
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class QuickSort extends Sort {
    constructor(blockWidth, breakPointer, pausePointer) {
        super(blockWidth, breakPointer, pausePointer);
    }

    instantSort(sizes, sortType) {
        const partitionsLeft = [0, sizes.length - 1];
        let top = 1;

        while (top >= 0) {
            const end = partitionsLeft[top--];
            const start = partitionsLeft[top--];

            // Handling current partition
            let currentIndex = start;
            const pivot = sizes[end];
            let i;
            for (i = start; i < end; i++) {
                if (sizes[i] <= pivot) {
                    [sizes[i], sizes[currentIndex]] = [sizes[currentIndex], sizes[i]];
                    currentIndex++;
                }
            }
            [sizes[currentIndex], sizes[end]] = [sizes[end], sizes[currentIndex]];

            // returned index of pivot
            if (currentIndex - 1 > start) {
                partitionsLeft[++top] = start;
                partitionsLeft[++top] = currentIndex - 1;
            }

            if (currentIndex + 1 < end) {
                partitionsLeft[++top] = currentIndex + 1;
                partitionsLeft[++top] = end;
            }
        }
        console.log(sizes);
    }

    makeSteps(sizesOrig, waitTime, animated = true, sortType = true) {
        this.stepsArr = [];
        this.stepsArr.push({
            stepNum: 'initial settings',
            blocksNum: sizesOrig.length
        });

        const sizes = [...sizesOrig];

        const partitionsLeft = [0, sizes.length - 1];
        let top = 1;

        while (top >= 0) {
            const end = partitionsLeft[top--];
            const start = partitionsLeft[top--];

            // Handling current partition
            let currentIndex = start;
            const pivotIndex = end;

            // Highlighting pivot
            this.addStep('colorBlocks', {
                    color: colors.highlight,
                    blocks: [pivotIndex]
            });

            this.addStep('wait', {waitTime})

            let i;
            for (i = start; i < end; i++) {
                // Highlighting i block
                this.addStep('colorBlocks', {
                        color: colors.accent,
                        blocks: [i]
                });
                this.stepsArr.push({
                    stepNum: 0,
                    arg: {
                        waitTime: waitTime
                    }
                });

                if (sizes[i] <= sizes[pivotIndex]) {
                    [sizes[i], sizes[currentIndex]] = [sizes[currentIndex], sizes[i]];

                    this.addStep('colorBlocks', {
                            color: colors.highlight,
                            blocks: [pivotIndex]
                    });
                    this.stepsArr.push({
                        stepNum: 0,
                        arg: {
                            waitTime: waitTime
                        }
                    });

                    this.stepsArr.push({
                        stepNum: 5,
                        arg: {
                            blocks: [i, currentIndex],
                            sizes: sizesOrig
                        }
                    });
                    this.stepsArr.push({
                        stepNum: 3,
                        arg: {
                            blocks: [i, currentIndex],
                            waitTime: waitTime
                        }
                    });
                    currentIndex++;

                    this.addStep('colorBlocks', {
                            blocks: [currentIndex],
                            color: colors.default
                    });
                }
                this.addStep('colorBlocks', {
                        blocks: [i],
                        color: colors.default
                });
            }
            [sizes[currentIndex], sizes[end]] = [sizes[end], sizes[currentIndex]];
            this.stepsArr.push({
                stepNum: 5,
                arg: {
                    blocks: [currentIndex, end],
                    sizes: sizesOrig
                }
            });
            this.stepsArr.push({
                stepNum: 3,
                arg: {
                    blocks: [currentIndex, end],
                    waitTime: waitTime
                }
            });

            this.addStep('colorBlocks', {
                    blocks: [pivotIndex],
                    color: colors.default
            });

            if (currentIndex - 1 > start) {
                partitionsLeft[++top] = start;
                partitionsLeft[++top] = currentIndex - 1;
            }

            if (currentIndex + 1 < end) {
                partitionsLeft[++top] = currentIndex + 1;
                partitionsLeft[++top] = end;
            }
        }
    }
}

export default QuickSort;
