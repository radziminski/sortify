import { DOMelements, colors, selectBlock } from '../base';

    //////////////////////////////////////////
////////////    BLOCKS RENDERING     /////////
    //////////////////////////////////////////

const renderCurrentBlock = async (block, height, index, animated = true) => {
    DOMelements.blocksList.insertAdjacentHTML('beforeend',
        `<li class="blocks__single-block id-${index} ${animated ? `animated fadeInUp` : null} "
            style="margin-left: ${block.blockMargin}px;
            margin-right: ${block.blockMargin}px;
            width: ${block.blockActualWidth}px;
            height: ${height}px;
            background-color: ${colors.default};">&nbsp;</li>`);
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

    export function colorAllBlocks(blocksNum, color = colors.default) {
        for (let i = 0; i < blocksNum; i++) colorSingleBlock(i, color);
    }

    export function clearTwoBlocksColors(blockA, blockB) {
        if (blockB !== blockA) {
            colorSingleBlock(blockA, colors.default);
            colorSingleBlock(blockB, colors.default);
        } else colorSingleBlock(blockA, colors.default);
    };

    export function swapBlocksHeight(blockA, blockB) {
        const firstBlock = selectBlock(blockA);
        const secondBlock = selectBlock(blockB);
        
        const temp = firstBlock.style.height;
        firstBlock.style.height = secondBlock.style.height;
        secondBlock.style.height = temp;
    };

    export function swapBlocksColors(blockA, blockB) {
        let colorTemp = selectBlock(blockA).style.backgroundColor;
        selectBlock(blockA).style.backgroundColor = selectBlock(blockB).style.backgroundColor;
        selectBlock(blockB).style.backgroundColor = colorTemp;
    }

export const clearBlocks = () => {
    DOMelements.blocksList.innerHTML = '';
};