//////////////////////////////////
// index.js //////////////////////
//////////////////////////////////

import Blocks from "./models/Blocks";
import * as blocksView from "./views/blocksView";
import SelectSort from "./models/Sorts/SelectSort";
import BubbleSort from "./models/Sorts/BubbleSort";
import InsertSort from "./models/Sorts/InsertSort";
import { DOMelements, selectBlock, colors, togglePlayIcon, highlightSortingBtn } from "./base";
import * as settingsView from "./views/settingsView";
import './../sass/main.scss';  
import './../css/animate.min.css';




// WEB INITIALIZATION

highlightSortingBtn(DOMelements.selectSortBtn);
const state = {
    sorting: false,
};


// for testing purposes: 
window.state = state;



//////////////////////////////////
// CONTROLLERS ///////////////////
//////////////////////////////////

const getBlocksNum = () => {
    return DOMelements.inputBlocksNumSlider.value;
}
const getTime = () => {
    return DOMelements.inputSortingSpeedSlider.value;
}
const getAnimate = () => {
    return DOMelements.inputAnimateCheckbox.checked;
}
const getSortType = () => {
    return DOMelements.inputSortTypeCheckbox.checked;
}
const getDisplayHeights = () => {
    return DOMelements.inputDisplayHeightsCheckbox.checked;
}

const renderBlocks = (blocksNum, minHeight = 20, maxHeight = 200) => {
    const contaninerWidth = DOMelements.blocksList.offsetWidth;
    console.log(contaninerWidth)
    let blockWidth = Math.floor(contaninerWidth / blocksNum * 100) / 100;
    if (blockWidth > 70) {
        blockWidth = 70;
    };
    state.sorting ? state.sorting.stop() : null;
    state.sorting.blockWidth = blockWidth;
    state.blocks = new Blocks(blocksNum, blockWidth);

    // Generate sizes
    state.blocks.generateBlocks(minHeight, maxHeight);

    // Render Blocks
    blocksView.renderBlocks(state.blocks.sizes, blockWidth);

    blocksView.toggleBlocksHeight(state.blocks.blocksNum, getDisplayHeights());
};

const reRenderBlocks = (minHeight = 20, maxHeight = 500) => {
    // const contaninerWidth = DOMelements.blocks.clientWidth - 65;
    const contaninerWidth = DOMelements.blocksList.offsetWidth;
    let blockWidth = Math.floor(contaninerWidth / state.blocks.blocksNum * 100) / 100;
    if (blockWidth > 70) {
        blockWidth = 70;
    };
    state.sorting.stop();
    state.sorting.blockWidth = blockWidth;
    state.blocks = new Blocks(state.blocks.blocksNum, blockWidth, state.blocks.sizes);

    blocksView.renderBlocks(state.blocks.sizes, blockWidth, false);

    blocksView.toggleBlocksHeight(state.blocks.blocksNum, getDisplayHeights());
}

/* Here go controllers */



//////////////////////////////////////////
/////////    EVENT LISTENERS     /////////
//////////////////////////////////////////

DOMelements.sortingButtons.addEventListener('click', event => {
    const selectedBtn = event.target;
    state.sorting.stop(state.blocks.blocksNum); // this should be in each case vv
    settingsView.changeToPlayIcon();
    switch (selectedBtn) {
        case DOMelements.bubbleSortBtn:
            highlightSortingBtn(selectedBtn);
            state.sorting = new BubbleSort(state.blocks.blockWidth, false, false);
            break;
        case DOMelements.selectSortBtn:
            highlightSortingBtn(selectedBtn);
            state.sorting = new SelectSort(state.blocks.blockWidth, false, false);
            break;
        case DOMelements.insertSortBtn:
            highlightSortingBtn(selectedBtn);
            state.sorting = new InsertSort(state.blocks.blockWidth, false, false);
            break;
        case DOMelements.quickSortBtn:
            highlightSortingBtn(selectedBtn);
            break;
        case DOMelements.mergeSortBtn:
            highlightSortingBtn(selectedBtn);
            break;
        case DOMelements.heapSortBtn:
            highlightSortingBtn(selectedBtn);
            break;
        case DOMelements.raddixSortBtn:
            highlightSortingBtn(selectedBtn);
            break;
        default: null;
    }
});

DOMelements.startSortBtn.addEventListener('click', event => {
    if (!state.sorting) return;
    
    if (settingsView.togglePlayIcon()) state.sorting.sortIt(state.blocks.sizes, getTime(), getAnimate(), getSortType());
    else state.sorting.pause();
    //state.sorting = true;
});

DOMelements.stopSortBtn.addEventListener('click', event => {
    state.sorting.stop(state.blocks.blocksNum);
    settingsView.changeToPlayIcon();
});

DOMelements.generateBlocksBtn.addEventListener('click', event => {
    state.sorting.stop(state.blocks.blocksNum);
    settingsView.changeToPlayIcon();
    //state.sorting = false;
    renderBlocks(getBlocksNum());
});

DOMelements.shuffleBlocksBtn.addEventListener('click', event => {
    state.sorting.stop(state.blocks.blocksNum);
    settingsView.changeToPlayIcon();
    state.blocks.blocksShuffle();
    reRenderBlocks(getBlocksNum());
});

DOMelements.inputBlocksNumSlider.addEventListener('input', event => {
    DOMelements.inputBlocksNumText.value = event.target.value;
});

DOMelements.inputBlocksNumText.addEventListener('input', event => {
    const value = event.target.value;
    if (value < 2) {
        DOMelements.inputBlocksNumSlider.value = 2;
        DOMelements.inputBlocksNumText.value = 2;
    } else if (value > 500) {
        DOMelements.inputBlocksNumSlider.value = 500;
        DOMelements.inputBlocksNumText.value = 500;
    } else {
        DOMelements.inputBlocksNumSlider.value = value;
    }
});

DOMelements.inputSortingSpeedSlider.addEventListener('input', event => {
    DOMelements.inputSortingSpeedText.value = Math.round(event.target.value / 10) / 100;
});

DOMelements.inputSortingSpeedText.addEventListener('input', event => {
    const value = event.target.value;
    if (isNaN(value)) {
        DOMelements.inputSortingSpeedSlider.value = 400;
        DOMelements.inputSortingSpeedText.value = 0.4;
    } else if (value < 0) {
        DOMelements.inputSortingSpeedSlider.value = 0;
        DOMelements.inputSortingSpeedText.value = 0;
    } else if (value > 1) {
        DOMelements.inputSortingSpeedSlider.value = 1000;
        DOMelements.inputSortingSpeedText.value = 1;
    } else {
        DOMelements.inputSortingSpeedSlider.value = value * 1000;
        DOMelements.inputSortingSpeedText.value = Math.round(value * 100) / 100;
    }
});

DOMelements.inputDisplayHeightsCheckbox.addEventListener('input', event => {
    blocksView.toggleBlocksHeight(state.blocks.blocksNum, event.target.checked);
})

window.addEventListener('load', () => {
    state.sorting = new SelectSort(null, false, false);
    renderBlocks(getBlocksNum());
});

window.addEventListener('resize', () => {
    state.sorting.stop(state.blocks.blocksNum);
    settingsView.changeToPlayIcon();
    reRenderBlocks();
});