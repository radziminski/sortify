import Sort from './Sort';
import { colors, selectBlock } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

const gradColors = ['#f23115', '#fff50f', '#00d427', '#4900d4', '#c100e8', '#e80306'];

class MergeSort extends Sort {
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

    makeSteps(sizesOrig, waitTime, animated = true, sortType = true) {
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
        gradColors = this.gradientBlocks(n / 4);
        gradColors = [
            '#FF6633',
            '#FFB399',
            '#FF33FF',
            '#FFFF99',
            '#00B3E6',
            '#E6B333',
            '#3366E6',
            '#999966',
            '#99FF99',
            '#6680B3',
            '#66991A',
            '#FF99E6',
            '#CCFF1A',
            '#FF1A66',
            '#E6331A',
            '#33FFCC',
            '#66994D',
            '#B366CC',
            '#4D8000',
            '#B33300',
            '#CC80CC',
            '#66664D',
        ];
        let colorPointer = 0;
        for (let i = 0; i < n + 1; i++) {
            let block = i;
            this.addStep('colorBlocks', {
                color: colors.current,
                blocks: [i]
            });
            block++;
            let divider = 4;
            let first = true;
            if (block % 2 === 0) {
                this.addStep('raiseBlocks', {
                    waitTime,
                    blocks: [i - 1, i]
                });
                this.sortPartition(sizes, sizesOrig, i - 1, i, waitTime);
                this.addStep('lowerBlocks', {
                    waitTime,
                    blocks: [i - 1, i]
                });
            }
            if ((Math.log(block) / Math.log(2)) % 1 === 0 && block > 3) {
                while (i - divider + 1 >= 0) {
                    console.log('current block: ' + block);
                    console.log('current i: ' + i);
                    console.log('first: ' + first);
                    console.log('\n');
                    const blocks = [];
                    for (let j = i - divider + 1; j <= i; j++) blocks.push(j);

                    this.addStep('raiseBlocks', {
                        waitTime,
                        blocks
                    });
                    this.sortPartition(sizes, sizesOrig, i - divider + 1, i, waitTime);
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
            }
            this.addStep('wait', { waitTime: waitTime / 2 });
        }
    }

    sortPartition(sizes, sizesOrig, firstBlock, lastBlock, waitTime) {
        let left = firstBlock;
        let right = Math.ceil((lastBlock - firstBlock) / 2) + firstBlock;
        const leftEnd = right;
        const rightEnd = lastBlock + 1;
        while (left < rightEnd) {
            const min = this.findMin(left, sizes.slice(0, rightEnd));
            if (min !== left) {
                this.addStep('arrSwap', { sizes: sizesOrig, blocks: [left, min] });
                this.addStep('lowerBlocks', {
                    waitTime,
                    blocks: [min]
                });
                this.addStep('swapAnimation', { waitTime, blocks: [left, min] });
                [sizes[left], sizes[min]] = [sizes[min], sizes[left]];
            } else {
                this.addStep('lowerBlocks', {
                    waitTime,
                    blocks: [min]
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
