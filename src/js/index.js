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

// FOUC fix
document.onreadystatechange = function() { 
    if (document.readyState === "complete") {
        DOMelements.loader.style.display = 'none';
        DOMelements.hideWrapper.style.visibility = 'visible';
        //elements.hideWrapper.style.opacity = 1;
    }
}

highlightSortingBtn(DOMelements.selectSortBtn);
const state = {
    sorting: false,
};


// for testing purposes: 
window.state = state;



//////////////////////////////////////////
/////////      CONTROLLERS       /////////
//////////////////////////////////////////


const getBlocksNum = () => parseInt(DOMelements.inputBlocksNumSlider.value);
const getMinHeight = () => parseInt(DOMelements.inputMinHeightSlider.value);
const getMaxHeight = () => parseInt(DOMelements.inputMaxHeightSlider.value);
const getTime = () => {
    switch(DOMelements.inputSortingSpeedSlider.value) {
        case '1':
            return 1500;
        case '2':
            return 700;
        case '3':
            return 300;
        case '4':
            return 100;
        case '5':
            return 50;
    }
}
const getAnimate = () => DOMelements.inputAnimateCheckbox.checked;
const getSortType = () => DOMelements.inputSortTypeDesCheckbox.checked;
const getDisplayHeights = () => DOMelements.inputDisplayHeightsCheckbox.checked;

const renderBlocks = (blocksNum, minHeight = 20, maxHeight = 200) => {
    const contaninerWidth = DOMelements.blocksList.offsetWidth;
    let blockWidth = Math.floor(contaninerWidth / blocksNum * 100) / 100;
    blockWidth > 70 ? blockWidth = 70 : null;

    state.sorting ? state.sorting.stop() : null;
    state.sorting.blockWidth = blockWidth;
    state.blocks = new Blocks(blocksNum, blockWidth);

    // Generate blocks sizes
    state.blocks.generateBlocks(minHeight, maxHeight);

    // Render Blocks
    blocksView.renderBlocks(state.blocks.sizes, blockWidth);
    blocksView.toggleBlocksHeight(state.blocks.blocksNum, getDisplayHeights());
};

const reRenderBlocks = () => {
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
    else {
        state.sorting.pause(state.blocks.sizes);
        console.log(state.blocks.sizes)
    }
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
    renderBlocks(getBlocksNum(), getMinHeight(), getMaxHeight());
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
    DOMelements.speedSliderLabels.forEach(element => {
        element.classList.remove('u-highlighted-text');
    })
    switch (event.target.value) {
        case '1':
            DOMelements.speedSliderLabelSupSlow.classList.add('u-highlighted-text');
            break;
        case '2':
            DOMelements.speedSliderLabelSlow.classList.add('u-highlighted-text');
            break;
        case '3':
            DOMelements.speedSliderLabelMedium.classList.add('u-highlighted-text');
            break;
        case '4':
            DOMelements.speedSliderLabelFast.classList.add('u-highlighted-text');
            break;
        case '5':
            DOMelements.speedSliderLabelSupFast.classList.add('u-highlighted-text');
            break;
    }
    
});

const sliderOverflowCheck = (min, max, type) => {
    if (max <= min) {
        if (type === 'max') {
            DOMelements.inputMinHeightText.value = max;
            DOMelements.inputMinHeightSlider.value = max;
        } else {
            DOMelements.inputMaxHeightText.value = min;
            DOMelements.inputMaxHeightSlider.value = min;
        }
    }
}

DOMelements.inputMaxHeightSlider.addEventListener('input', event => {
    DOMelements.inputMaxHeightText.value = event.target.value;
    sliderOverflowCheck(getMinHeight(), parseInt(event.target.value), 'max');
});

DOMelements.inputMaxHeightText.addEventListener('input', event => {
    if (event.target.value < 20) event.target.value = 20;
    if (event.target.value > 300) event.target.value = 300;
    DOMelements.inputMaxHeightSlider.value = event.target.value;
    sliderOverflowCheck(getMinHeight(), parseInt(event.target.value), 'max');
});


DOMelements.inputMinHeightSlider.addEventListener('input', event => {
    DOMelements.inputMinHeightText.value = event.target.value;
    sliderOverflowCheck(parseInt(event.target.value), getMaxHeight(), 'min');
});

DOMelements.inputMinHeightText.addEventListener('input', event => {
    if (event.target.value < 20) event.target.value = 20;
    if (event.target.value > 300) event.target.value = 300;
    DOMelements.inputMinHeightSlider.value = event.target.value;
    sliderOverflowCheck(parseInt(event.target.value), getMaxHeight(), 'min');
});

DOMelements.inputDisplayHeightsCheckbox.addEventListener('input', event => {
    blocksView.toggleBlocksHeight(state.blocks.blocksNum, event.target.checked);
});

window.addEventListener('load', () => {
    state.sorting = new SelectSort(null, false, false);
    renderBlocks(getBlocksNum(), getMinHeight(), getMaxHeight());
});

window.addEventListener('resize', () => {
    state.sorting.stop(state.blocks.blocksNum);
    settingsView.changeToPlayIcon();
    reRenderBlocks();
});