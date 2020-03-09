import { DOMelements } from '../base';

/////////// Sorting Buttons ////////////////

export function highlightSortingBtn(btn) {
    const allBtns = DOMelements.allSortingBtns;
    allBtns.forEach(btn => btn.classList.remove('btn--active'));
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

export const setComparisonNum = num => {
    DOMelements.comparisonsNum.innerHTML = num;
};

export const addToComparisonNum = num => {
    let previousNum = DOMelements.comparisonsNum.innerHTML * 1;
    previousNum += num;
    DOMelements.comparisonsNum.innerHTML = previousNum;

}

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
