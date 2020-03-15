import Sort from './Sort';
import { colors, selectBlock } from '../../base';
import * as blocksView from '../../views/blocksView';

const gradColors = ['#f23115', '#fff50f', '#00d427', '#4900d4', '#c100e8', '#e80306'];

class MergeSort extends Sort {
    getType() {
        return 'mergeSort';
    }

    instantMerge(arr1, arr2, sortType, comparisons) {
        const results = [];
        let i = 0;
        let j = 0;

        while (i < arr1.length && j < arr2.length) {
            if ((arr2[j] > arr1[i] && !sortType) || (arr2[j] < arr1[i] && sortType)) {
                results.push(arr1[i]);
                i++;
            } else {
                results.push(arr2[j]);
                j++;
            }
            comparisons.num++;
        }
        while (i < arr1.length) {
            results.push(arr1[i]);
            i++;
        }
        while (j < arr2.length) {
            results.push(arr2[j]);
            j++;
        }
        return results;
    }

    // Recrusive Merge Sort
    mergeSort(arr, sortType, comparisons) {
        if (arr.length <= 1) return arr;
        let left, right;
        const mid = Math.floor(arr.length / 2);
        left = this.mergeSort(arr.slice(0, mid), sortType, comparisons);
        right = this.mergeSort(arr.slice(mid), sortType, comparisons);
        return this.instantMerge(left, right, sortType, comparisons);
    }

    instantSort(sizes, sortType) {
        let newSizes;
        const comparisons = {
            num: 0
        };
        newSizes = this.mergeSort(sizes, sortType, comparisons);
        for (let i = 0; i < sizes.length; i++) sizes[i] = newSizes[i];
        return comparisons.num;
    }

    gradientBlocks(blocksNum) {
        let useColors = gradColors;
        if (blocksNum < 100) useColors = gradColors.slice(0, 5);
        if (blocksNum < 50) useColors = gradColors.slice(0, 4);
        const colorsHalf = multiColorGradient(blocksNum / 2, ...useColors.slice());
        const colors = [];
        colorsHalf.forEach(el => {
            colors.push(el);
            colors.push(el);
        });
        for (let block = 0; block < blocksNum; block++) {
            blocksView.colorSingleBlock(block, colors[block]);
        }
        return colors;
    }

    makeSteps(sizesOrig, waitTime, sortType = true) {
        this.stepsArr = [];
        this.stepsArr.push({
            stepNum: 'initial settings',
            blocksNum: sizesOrig.length
        });
        const sizes = [...sizesOrig];
        let n = sizes.length;

        // Gradient coloring blocks
        let gradColors = this.gradientBlocks(n);
        for (let i = 0; i < n; i++) {
            this.addStep('colorBlocks', {
                color: gradColors[i],
                blocks: [i]
            });
        }
        const someColors = [
            '#8200fb',
            '#00fb8e',
            '#fb00ab',
            '#4900d4',
            '#f23115',
            '#c100e8',
            '#fff50f',
            '#00e5fb'
        ].reverse();
        gradColors = [];
        for (let i = 0; i < n / 10; i++) {
            gradColors.push(...someColors);
        }
        let colorPointer = 0;
        let biggestPartition = 2;

        for (let i = 0; i < n; i++) {
            let block = i;
            this.addStep('colorBlocks', {
                color: colors.current,
                blocks: [i]
            });
            block++;
            let divider = 4;
            if (block % 2 === 0) {
                this.addStep('raiseBlocks', {
                    waitTime,
                    blocks: [i - 1, i]
                });
                this.sortPartition(sizes, sizesOrig, i - 1, i, waitTime, sortType);
                this.addStep('lowerBlocks', {
                    waitTime,
                    blocks: [i - 1, i]
                });
                this.addStep('colorBlocks', {
                    color: gradColors[colorPointer],
                    blocks: [i - 1, i]
                });
                colorPointer++;
            }
            if ((Math.log(block) / Math.log(2)) % 1 === 0 && block > 3) {
                biggestPartition = block;
                while (i - divider + 1 >= 0) {
                    const blocks = [];
                    for (let j = i - divider + 1; j <= i; j++) blocks.push(j);

                    this.addStep('raiseBlocks', {
                        waitTime,
                        blocks
                    });
                    this.sortPartition(sizes, sizesOrig, i - divider + 1, i, waitTime, sortType);
                    this.addStep('lowerBlocks', {
                        waitTime,
                        blocks
                    });
                    this.addStep('colorBlocks', {
                        color: gradColors[colorPointer],
                        blocks
                    });
                    colorPointer++;
                    divider *= 2;
                }
            } else if (
                (Math.log(block - biggestPartition) / Math.log(2)) % 1 === 0 &&
                block - biggestPartition > 3
            ) {
                const blocks = [];
                for (let j = biggestPartition; j <= i; j++) blocks.push(j);
                this.addStep('raiseBlocks', {
                    waitTime,
                    blocks
                });
                this.sortPartition(sizes, sizesOrig, biggestPartition, i, waitTime, sortType);
                this.addStep('lowerBlocks', {
                    waitTime,
                    blocks
                });
                this.addStep('colorBlocks', {
                    color: gradColors[colorPointer],
                    blocks
                });
                colorPointer++;
            }

            this.addStep('wait', { waitTime: waitTime / 2 });
        }
        if ((Math.log(sizes.length) / Math.log(2)) % 1 !== 0) {
            const blocks = [];
            for (let j = 0; j < sizes.length; j++) blocks.push(j);
            this.addStep('raiseBlocks', {
                waitTime,
                blocks
            });
            this.sortPartition(sizes, sizesOrig, 0, sizes.length - 1, waitTime, sortType);
            this.addStep('lowerBlocks', {
                waitTime,
                blocks
            });
        }
    }

    sortPartition(sizes, sizesOrig, firstBlock, lastBlock, waitTime, sortType) {
        let left = firstBlock;
        const rightEnd = lastBlock + 1;
        while (left < rightEnd) {
            if (left !== firstBlock) this.addStep('updtComparisons', {});
            let selected = this.findMin(left, sizes.slice(0, rightEnd));
            if (sortType) selected = this.findMax(left, sizes.slice(0, rightEnd));
            if (selected !== left) {
                this.addStep('lowerBlocks', {
                    waitTime,
                    blocks: [selected]
                });
                let curr = selected;

                while (curr > left) {
                    this.addStep('swapAnimation', {
                        waitTime: waitTime / 2,
                        blocks: [curr, curr - 1]
                    });
                    [sizes[curr], sizes[curr - 1]] = [sizes[curr - 1], sizes[curr]];
                    this.addStep('arrSwap', { sizes: sizesOrig, blocks: [curr, curr - 1] });

                    curr--;
                }
            } else {
                this.addStep('lowerBlocks', {
                    waitTime,
                    blocks: [selected]
                });
            }
            left++;
        }
    }
}

export default MergeSort;

function gradient(startColor, endColor, stepsNum) {
    const start = {
        Hex: startColor,
        R: parseInt(startColor.slice(1, 3), 16),
        G: parseInt(startColor.slice(3, 5), 16),
        B: parseInt(startColor.slice(5, 7), 16)
    };
    const end = {
        Hex: endColor,
        R: parseInt(endColor.slice(1, 3), 16),
        G: parseInt(endColor.slice(3, 5), 16),
        B: parseInt(endColor.slice(5, 7), 16)
    };
    const diffR = end['R'] - start['R'];
    const diffG = end['G'] - start['G'];
    const diffB = end['B'] - start['B'];

    const stepsHex = new Array();
    const stepsR = new Array();
    const stepsG = new Array();
    const stepsB = new Array();

    for (let i = 0; i <= stepsNum; i++) {
        stepsR[i] = start['R'] + (diffR / stepsNum) * i;
        stepsG[i] = start['G'] + (diffG / stepsNum) * i;
        stepsB[i] = start['B'] + (diffB / stepsNum) * i;
        stepsHex[i] =
            '#' +
            (Math.round(stepsR[i]).toString(16).length === 1
                ? '0' + Math.round(stepsR[i]).toString(16)
                : Math.round(stepsR[i]).toString(16)) +
            (Math.round(stepsG[i]).toString(16).length === 1
                ? '0' + Math.round(stepsG[i]).toString(16)
                : Math.round(stepsG[i]).toString(16)) +
            (Math.round(stepsB[i]).toString(16).length === 1
                ? '0' + Math.round(stepsB[i]).toString(16)
                : Math.round(stepsB[i]).toString(16));
    }
    return stepsHex;
}

function multiColorGradient(stepNum, ...colors) {
    const gradientsNum = colors.length - 1;
    const stepsModuloColors = stepNum % gradientsNum;
    const colorsPerStep =
        stepsModuloColors !== 0
            ? Math.floor(stepNum / gradientsNum)
            : Math.floor(stepNum / gradientsNum) - 1;
    const newColors = [];
    newColors.push(colors[0]);
    for (let i = 0; i < gradientsNum; i++) {
        let gradientLength = colorsPerStep;
        if (stepsModuloColors > gradientsNum - i) gradientLength++;
        if (stepsModuloColors === 0 && gradientsNum > gradientsNum - i) gradientLength++;
        const gradientArr = gradient(colors[i], colors[i + 1], gradientLength);
        gradientArr.shift();
        gradientArr.forEach(el => newColors.push(el));
    }
    return newColors;
}
