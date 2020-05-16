import { DOMelements, sortingComplexities, calculateAvgComplexity } from '../base';

/////////// Sorting Buttons ////////////////

export function highlightSortingBtn(btn) {
    const allBtns = DOMelements.allSortingBtns;
    allBtns.forEach((btn) => btn.classList.remove('btn--active'));
    btn.classList.add('btn--active');
}

/////////// Changing play Button ///////////
export const togglePlayIcon = () => {
    let curr = DOMelements.startSortBtn.name;
    if (curr !== 'play') {
        DOMelements.startSortBtn.name = 'play';
        return false;
    }
    DOMelements.startSortBtn.name = 'pause';
    return true;
};

export const changeToPlayIcon = () => {
    DOMelements.startSortBtn.name = 'play';
};

export const changeToPauseIcon = () => {
    DOMelements.startSortBtn.name = 'pause';
};

/////////// AnimationsChange ///////////

export const turnOnAnimations = (checked) => {
    DOMelements.inputAnimateCheckbox.checked = checked;
};

/////////// Comparisons ///////////

export const incrementComparisonsNum = () => {
    let previousNum = DOMelements.comparisonsNum.innerHTML;
    previousNum = parseInt(previousNum);
    previousNum++;
    DOMelements.comparisonsNum.innerHTML = previousNum;
};

export const resetComparisonsNum = () => {
    DOMelements.comparisonsNum.innerHTML = 0;
};

export const setComparisonNum = (num) => {
    DOMelements.comparisonsNum.innerHTML = num;
};

export const addToComparisonNum = (num) => {
    let previousNum = DOMelements.comparisonsNum.innerHTML * 1;
    previousNum += num;
    DOMelements.comparisonsNum.innerHTML = previousNum;
};

/////////// Complexity ///////////

export const setComplexityLabel = (label) => {
    DOMelements.complexityLabel.innerHTML = label;
};

export const setDefaultComplexity = (num) => {
    DOMelements.complexityAvgNum.innerHTML = num;
};

export const updateComplexity = (blocksNum, sorting) => {
    setComplexityLabel(sortingComplexities[sorting]);
    setDefaultComplexity(calculateAvgComplexity(blocksNum, sorting));
};

/////////// getting input values ///////////

export const getBlocksNum = () => parseInt(DOMelements.inputBlocksNumSlider.value);
export const getMinHeight = () => parseInt(DOMelements.inputMinHeightSlider.value);
export const getMaxHeight = () => parseInt(DOMelements.inputMaxHeightSlider.value);
export const getTime = () => {
    switch (DOMelements.inputSortingSpeedSlider.value) {
        case '1':
            return 1500;
        case '2':
            return 700;
        case '3':
            return 300;
        case '4':
            return 100;
        case '5':
            return 0;
    }
};
export const getAnimate = () => DOMelements.inputAnimateCheckbox.checked;
export const getSortType = () => DOMelements.inputSortTypeDesCheckbox.checked;
export const getDisplayHeights = () => DOMelements.inputDisplayHeightsCheckbox.checked;
