import Blocks from './models/Blocks';
import * as blocksView from './views/blocksView';
import * as settingsView from './views/settingsView';
import SelectSort from './controllers/SortControllers/SelectSort';
import BubbleSort from './controllers/SortControllers/BubbleSort';
import InsertSort from './controllers/SortControllers/InsertSort';
import QuickSort from './controllers/SortControllers/QuickSort';
import MergeSort from './controllers/SortControllers/MergeSort';
import { DOMelements, sortingComplexities, selectBlock } from './base';
import './../sass/main.scss';
import './../css/animate.min.css';

//////////////////////////////////////////
////////   WEB INITIALIZATION     ////////
//////////////////////////////////////////

// Handling FOUC
document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        DOMelements.loader.style.display = 'none';
        DOMelements.hideWrapper.style.visibility = 'visible';
    }
};

const state = {
    sorting: false,
    stopSorting: () => {
        state.sorting ? state.sorting.stop(state.blocks.blocksNum) : null;
        settingsView.resetComparisonsNum();
        checkRednerBlocksAgainstLogicBlocks();
    },
    showHeights: false,
};

//////////////////////////////////////////
////////    BLOCK CONTROLLERS     ////////
//////////////////////////////////////////

const renderBlocks = (blocksNum, minHeight = 20, maxHeight = 200) => {
    const blockWidth = blocksView.calculateBlockWidth(blocksNum);

    state.sorting ? state.sorting.updateBlockWidth(blockWidth) : null;

    state.blocks = new Blocks(blocksNum, blockWidth);

    // Generate blocks sizes
    state.blocks.generateBlocks(minHeight, maxHeight);

    // Updating performance data
    settingsView.updateComplexity(blocksNum, state.sorting.getType());

    // Render Blocks
    blocksView.renderBlocks(state.blocks.sizes, blockWidth);
    blocksView.toggleBlocksHeight(state.blocks.blocksNum, settingsView.getDisplayHeights());
};

const reRenderBlocks = () => {
    let blockWidth = blocksView.calculateBlockWidth(state.blocks.blocksNum);

    state.sorting.updateBlockWidth(blockWidth);

    state.blocks = new Blocks(state.blocks.blocksNum, blockWidth, state.blocks.sizes);

    settingsView.updateComplexity(state.blocks.blocksNum, state.sorting.getType());

    blocksView.renderBlocks(state.blocks.sizes, blockWidth, false);
    blocksView.toggleBlocksHeight(state.blocks.blocksNum, settingsView.getDisplayHeights());
};

const checkRednerBlocksAgainstLogicBlocks = () => {
    if (!state.blocks.sizes || !state.blocks.sizes.length) return;
    for (let block = 0; block < state.blocks.sizes.length; block++) {
        state.showHeights
            ? blocksView.setBlocksHeight(block, state.blocks.sizes[block])
            : blocksView.setBlocksHeight(block, state.blocks.sizes[block], false);
    }
};

//////////////////////////////////////////
///////   INPUT HELP FUNCTIONS    ////////
//////////////////////////////////////////

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
};

//////////////////////////////////////////
/////////    EVENT LISTENERS     /////////
//////////////////////////////////////////

DOMelements.sortingButtons.addEventListener('click', (event) => {
    state.stopSorting();

    const selectedBtn = event.target;

    switch (selectedBtn) {
        case DOMelements.bubbleSortBtn:
            settingsView.highlightSortingBtn(selectedBtn);
            settingsView.setComplexityLabel(sortingComplexities.bubbleSort);
            settingsView.updateComplexity(state.blocks.blocksNum, 'bubbleSort');
            state.sorting = new BubbleSort(state.blocks.blockWidth, false, false);
            break;

        case DOMelements.selectSortBtn:
            settingsView.highlightSortingBtn(selectedBtn);
            settingsView.setComplexityLabel(sortingComplexities.selectSort);
            settingsView.updateComplexity(state.blocks.blocksNum, 'selectSort');
            state.sorting = new SelectSort(state.blocks.blockWidth, false, false);
            break;

        case DOMelements.insertSortBtn:
            settingsView.highlightSortingBtn(selectedBtn);
            settingsView.setComplexityLabel(sortingComplexities.insertSort);
            settingsView.updateComplexity(state.blocks.blocksNum, 'insertSort');
            state.sorting = new InsertSort(state.blocks.blockWidth, false, false);
            break;

        case DOMelements.quickSortBtn:
            settingsView.highlightSortingBtn(selectedBtn);
            settingsView.updateComplexity(state.blocks.blocksNum, 'quickSort');
            state.sorting = new QuickSort(state.blocks.blockWidth, false, false);
            break;

        case DOMelements.mergeSortBtn:
            settingsView.highlightSortingBtn(selectedBtn);
            settingsView.updateComplexity(state.blocks.blocksNum, 'mergeSort');
            state.sorting = new MergeSort(state.blocks.blockWidth, false, false);
            break;

        default:
            null;
    }
});

DOMelements.startSortBtn.addEventListener('click', () => {
    if (!state.sorting) return;

    if (settingsView.togglePlayIcon()) {
        checkRednerBlocksAgainstLogicBlocks();
        state.sorting.sortIt(
            state.blocks.sizes,
            settingsView.getTime(),
            settingsView.getAnimate(),
            settingsView.getSortType()
        );
    } else {
        state.sorting.pause();
    }
});

DOMelements.stopSortBtn.addEventListener('click', state.stopSorting);

DOMelements.generateBlocksBtn.addEventListener('click', () => {
    state.stopSorting();
    renderBlocks(settingsView.getBlocksNum(), settingsView.getMinHeight(), settingsView.getMaxHeight());
});

DOMelements.shuffleBlocksBtn.addEventListener('click', () => {
    state.stopSorting();

    state.blocks.blocksShuffle();
    reRenderBlocks(settingsView.getBlocksNum());
});

DOMelements.inputBlocksNumSlider.addEventListener('input', (event) => {
    DOMelements.inputBlocksNumText.value = event.target.value;
});

DOMelements.inputBlocksNumText.addEventListener('input', (event) => {
    const { value } = event.target;
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

DOMelements.inputSortingSpeedSlider.addEventListener('input', (event) => {
    DOMelements.speedSliderLabels.forEach((element) => {
        element.classList.remove('u-highlighted-text');
    });
    settingsView.turnOnAnimations(true);
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
            settingsView.turnOnAnimations(false);
            DOMelements.speedSliderLabelFast.classList.add('u-highlighted-text');
            break;
        case '5':
            settingsView.turnOnAnimations(false);
            DOMelements.speedSliderLabelSupFast.classList.add('u-highlighted-text');
            break;
    }
});

DOMelements.inputMaxHeightSlider.addEventListener('input', (event) => {
    DOMelements.inputMaxHeightText.value = event.target.value;
    sliderOverflowCheck(settingsView.getMinHeight(), parseInt(event.target.value), 'max');
});

DOMelements.inputMaxHeightText.addEventListener('input', (event) => {
    if (event.target.value < 20) event.target.value = 20;
    if (event.target.value > 300) event.target.value = 300;
    DOMelements.inputMaxHeightSlider.value = event.target.value;
    sliderOverflowCheck(settingsView.getMinHeight(), parseInt(event.target.value), 'max');
});

DOMelements.inputMinHeightSlider.addEventListener('input', (event) => {
    DOMelements.inputMinHeightText.value = event.target.value;
    sliderOverflowCheck(parseInt(event.target.value), settingsView.getMaxHeight(), 'min');
});

DOMelements.inputMinHeightText.addEventListener('input', (event) => {
    if (event.target.value < 20) event.target.value = 20;
    if (event.target.value > 300) event.target.value = 300;
    DOMelements.inputMinHeightSlider.value = event.target.value;
    sliderOverflowCheck(parseInt(event.target.value), settingsView.getMaxHeight(), 'min');
});

DOMelements.inputDisplayHeightsCheckbox.addEventListener('input', (event) => {
    blocksView.toggleBlocksHeight(state.blocks.blocksNum, event.target.checked);
    state.showHeights = !state.showHeights;
});

window.addEventListener('load', () => {
    state.sorting = new SelectSort(null, false, false);
    renderBlocks(settingsView.getBlocksNum(), settingsView.getMinHeight(), settingsView.getMaxHeight());
    settingsView.highlightSortingBtn(DOMelements.selectSortBtn);
    settingsView.setComplexityLabel(sortingComplexities.insertSort);
    settingsView.setDefaultComplexity(20 * 20);
});

window.addEventListener('resize', () => {
    state.sorting.stop(state.blocks.blocksNum);
    reRenderBlocks();
});
