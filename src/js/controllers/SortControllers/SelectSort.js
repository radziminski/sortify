import Sort from './Sort';
import { colors } from '../../base';

class SelectSort extends Sort {
    getType() {
        return 'selectSort';
    }

    instantSort(sizes, sortType) {
        let comparisons = 0;
        for (let i = 0; i < sizes.length - 1; i++) {
            let max = sortType ? this.findMax(i, sizes) : this.findMin(i, sizes);
            max != i ? this.arrSwap(sizes, i, max) : null;
            comparisons += sizes.length - i - 1;
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

        for (let currentBlock = 0; currentBlock < sizes.length; currentBlock++) {
            // coloring already sorted previous block
            currentBlock > 0
                ? this.addStep('colorBlocks', {
                      color: colors.sorted,
                      blocks: [currentBlock - 1],
                  })
                : null;

            // wait if not in first iteration
            if (currentBlock !== 0) this.addStep('wait', { waitTime });

            // highliting current block
            this.addStep('colorBlocks', {
                color: colors.current,
                blocks: [currentBlock],
            });

            this.addStep('wait', { waitTime });

            // finding curent max / min block
            const maxBlock = sortType ? this.findMax(currentBlock, sizes) : this.findMin(currentBlock, sizes);

            // displaying searching procedure as sequence of coloring
            if (waitTime > 100) {
                let max = currentBlock;
                for (let nextBlock = currentBlock + 1; nextBlock < sizesOrig.length; nextBlock++) {
                    // coloring block that we are currently investigating for being max / min
                    this.addStep('colorBlocks', {
                        color: colors.highlight,
                        blocks: [nextBlock],
                    });
                    this.addStep('updtComparisons', {});
                    this.addStep('wait', { waitTime });

                    // checking if it is bigger / smaller than previous max / min
                    if ((sizes[nextBlock] > sizes[max] && sortType) || (sizes[nextBlock] < sizes[max] && !sortType)) {
                        // if yes coloring it and clearing previous max
                        if (max !== currentBlock) {
                            this.addStep('colorBlocks', {
                                color: colors.default,
                                blocks: [max],
                            });
                        }

                        this.addStep('colorBlocks', {
                            color: colors.chosen,
                            blocks: [nextBlock],
                        });

                        // and updating current max / min
                        max = nextBlock;
                        this.addStep('wait', { waitTime });
                    } else {
                        // if not clearing hgighlight
                        this.addStep('colorBlocks', {
                            color: colors.default,
                            blocks: [nextBlock],
                        });
                        this.addStep('wait', { waitTime: 50 });
                    }
                }
            } else {
                this.addStep('wait', { waitTime: 50 });
                this.addStep('updtComparisons', {
                    num: sizes.length - currentBlock - 1,
                });
            }

            // if max is not current block we need to do swap and swap animation
            if (maxBlock !== currentBlock) {
                this.addStep('wait', { waitTime });

                // highliting found max / min block
                this.addStep('colorBlocks', {
                    color: colors.current,
                    blocks: [maxBlock],
                });

                // swapping future array values
                this.addStep('arrSwap', {
                    sizes: sizesOrig,
                    blocks: [currentBlock, maxBlock],
                });

                // swapping current array values
                this.arrSwap(sizes, currentBlock, maxBlock);

                this.addStep('wait', { waitTime });

                // displaying or not blocks switch animation and switching their properties
                this.addStep('swapAnimation', { blocks: [currentBlock, maxBlock], waitTime: waitTime });
            } else {
                // if curreent block is max then we just move to next one
                this.addStep('wait', { waitTime: waitTime / 3 });

                //???
                this.addStep('colorBlocks', {
                    color: colors.default,
                    blocks: [sizesOrig.length - 1],
                });
            }

            this.addStep('wait', { waitTime });

            // clearing colors
            this.addStep('colorBlocks', {
                color: colors.default,
                blocks: [currentBlock, maxBlock],
            });
        }

        // coloring last blocks as sorted
        this.addStep('colorBlocks', {
            color: colors.sorted,
            blocks: [sizes.length - 1, sizes.length - 2],
        });

        this.addStep('wait', { waitTime });
    }
}

export default SelectSort;
