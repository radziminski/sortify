import { DOMelements, colors, selectBlock } from '../base';

    //////////////////////////////////////////
////////////    BLOCKS RENDERING     /////////
    //////////////////////////////////////////

const renderCurrentBlock = async (block, height, index, animated = true) => {
    DOMelements.blocksList.insertAdjacentHTML('beforeend',
        `<li class="section-blocks__single-block id-${index} ${animated ? `animated fadeInUp` : null} "
            style="margin-left: ${block.blockMargin}px;
            margin-right: ${block.blockMargin}px;
            width: ${block.blockActualWidth}px;
            height: ${height}px;
            background-color: ${colors.default};">${height}</li>`);
}

export const renderBlocks = async (sizes, blockWidth, animated = true) => {
   
    const block = {
        blockActualWidth: Math.floor((3 * blockWidth / 4) * 100) / 100,
        blockMargin: Math.floor((blockWidth / 8) * 100) / 100,
    }
    if (block.blockMargin < 1) {
        block.blockActualWidth = blockWidth;
        block.blockMargin = 0;
    }
    // const maxHeight = Math.max.apply(null, sizes);
    clearBlocks();
    for (let i = 0; i < sizes.length; i++) {
        renderCurrentBlock(block, sizes[i], i, animated);
    }
};

//////////////////////////////////////////////
///////////   BLOCKS COLOR METHODS    ////////
//////////////////////////////////////////////

    export function colorSingleBlock(block, color) {
        selectBlock(block).style.backgroundColor = color;
    }

    export function colorSeveralBlocks(color, ...blocks) {
        blocks.forEach(block => {
            colorSingleBlock(block, color);
        })
    }

    export function colorSeveralBlocksArr(color, blocks) {
        blocks.forEach(block => {
            colorSingleBlock(block, color);
        })
    }

    export function colorAllBlocks(blocksNum, color = colors.default) {
        for (let i = 0; i < blocksNum; i++) colorSingleBlock(i, color);
    }

    export function clearTwoBlocksColors(blockA, blockB) {
        if (blockB !== blockA) {
            colorSingleBlock(blockA, colors.default);
            colorSingleBlock(blockB, colors.default);
        } else colorSingleBlock(blockA, colors.default);
    };

    export function clearRaiseBlocks(blocksNum) {
        for (let i = 0; i < blocksNum; i++) selectBlock(i).style.marginBottom = '0px';
    }

    export function swapBlocksHeight(blockA, blockB) {
        const firstBlock = selectBlock(blockA);
        const secondBlock = selectBlock(blockB);
        
        const temp = firstBlock.style.height;
        firstBlock.style.height = secondBlock.style.height;
        secondBlock.style.height = temp;

        const temp2 = firstBlock.innerHTML;
        firstBlock.innerHTML= secondBlock.innerHTML;
        secondBlock.innerHTML = temp2;
    };

    export function toggleBlocksHeight(blocksNum, show = 1) {
        for (let i = 0; i < blocksNum; i++) {
            const block = selectBlock(i);
            if (!show) {
                block.innerHTML = " ";
            } else {
                block.innerHTML = parseInt(block.style.height);
                if (blocksNum > 25) block.style.fontSize = '1.2rem';
                if (blocksNum > 35) block.style.fontSize = '0.9rem';
                if (blocksNum > 50) block.style.fontSize = '0.6rem';
                if (blocksNum > 70) block.style.fontSize = '0.4rem';
                if (blocksNum > 100) block.style.fontSize = '0rem';
            }
        }
    }

    export function swapBlocksColors(blockA, blockB) {
        let colorTemp = selectBlock(blockA).style.backgroundColor;
        selectBlock(blockA).style.backgroundColor = selectBlock(blockB).style.backgroundColor;
        selectBlock(blockB).style.backgroundColor = colorTemp;
    }

    

    export const clearBlocks = () => {
        DOMelements.blocksList.innerHTML = '';
    };

    export const disableTransition = (blocksNum) => {
        for (let i = 0; i < blocksNum; i++) {
            selectBlock(i).classList.add('u-disable-transition');
        }
    }

    export const enableTransition = (blocksNum) => {
        for (let i = 0; i < blocksNum; i++) {
            selectBlock(i).classList.remove('u-disable-transition');
        }
    }