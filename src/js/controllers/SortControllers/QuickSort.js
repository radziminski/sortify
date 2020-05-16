import Sort from './Sort';
import { colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class QuickSort extends Sort {
    getType() {
        return 'quickSort';
    }

    instantSort(sizes, sortType) {
        const partitionsLeft = [0, sizes.length - 1];
        let top = 1;
        let comparisons = 0;

        while (top >= 0) {
            const end = partitionsLeft[top--];
            const start = partitionsLeft[top--];

            // Handling current partition
            let currentIndex = start;
            const pivot = sizes[end];
            let i;
            for (i = start; i < end; i++) {
                if ((sizes[i] <= pivot && !sortType) || (sizes[i] >= pivot && sortType)) {
                    [sizes[i], sizes[currentIndex]] = [sizes[currentIndex], sizes[i]];
                    currentIndex++;
                }
                comparisons++;
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
        return comparisons;
    }

    makeSteps(sizesOrig, waitTime, sortType = true) {
        this.stepsArr = [];
        this.stepsArr.push({
            stepNum: 'initial settings',
            blocksNum: sizesOrig.length,
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
                blocks: [pivotIndex],
            });

            this.addStep('wait', { waitTime });

            let i;
            for (i = start; i < end; i++) {
                // Highlighting i block
                this.addStep('colorBlocks', {
                    color: colors.accent,
                    blocks: [i],
                });
                this.addStep('wait', { waitTime });

                if (sizes[i] <= sizes[pivotIndex]) {
                    [sizes[i], sizes[currentIndex]] = [sizes[currentIndex], sizes[i]];

                    this.addStep('colorBlocks', {
                        color: colors.highlight,
                        blocks: [pivotIndex],
                    });
                    this.addStep('wait', { waitTime });

                    this.addStep('arrSwap', { blocks: [i, currentIndex], sizes: sizesOrig });

                    this.addStep('swapAnimation', { blocks: [i, currentIndex], waitTime: waitTime });
                    currentIndex++;

                    this.addStep('colorBlocks', {
                        blocks: [currentIndex],
                        color: colors.default,
                    });
                }
                this.addStep('colorBlocks', {
                    blocks: [i],
                    color: colors.default,
                });
            }
            [sizes[currentIndex], sizes[end]] = [sizes[end], sizes[currentIndex]];

            this.addStep('arrSwap', { blocks: [currentIndex, end], sizes: sizesOrig });

            this.addStep('swapAnimation', { blocks: [currentIndex, end], waitTime: waitTime });

            this.addStep('colorBlocks', {
                blocks: [pivotIndex],
                color: colors.default,
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
