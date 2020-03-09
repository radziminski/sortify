export const DOMelements = {
    // Layout
    loader: document.querySelector('.loader-box'),
    hideWrapper: document.querySelector('.hide-wrapper'),

    // Blocks
    blocks: document.querySelector('.section-blocks'),
    blocksList: document.querySelector('.section-blocks__list'),

    // Performance
    comparisonsNum: document.querySelector('.js--comp-num'),

    // Sorting Btns
    buttons: document.querySelector('.section-controls__sorting-buttons'),
    allSortingBtns: document.querySelectorAll('.js--sort-btn'),
    sortingButtons: document.querySelector('.section-controls__sorting-buttons'),
    bubbleSortBtn: document.querySelector('.js--bubble-btn'),
    selectSortBtn: document.querySelector('.js--select-btn'),
    insertSortBtn: document.querySelector('.js--insert-btn'),
    quickSortBtn: document.querySelector('.js--quick-btn'),
    mergeSortBtn: document.querySelector('.js--merge-btn'),
    heapSortBtn: document.querySelector('.js--heap-btn'),
    raddixSortBtn: document.querySelector('.js--raddix-btn'),

    // Sorting speed slider
    speedSliderLabels: document.querySelectorAll('.js--speed-slider-label'),
    speedSliderLabelSupSlow: document.querySelector('.js--speed-slider-label-sslow'),
    speedSliderLabelSlow: document.querySelector('.js--speed-slider-label-slow'),
    speedSliderLabelMedium: document.querySelector('.js--speed-slider-label-medium'),
    speedSliderLabelFast: document.querySelector('.js--speed-slider-label-fast'),
    speedSliderLabelSupFast: document.querySelector('.js--speed-slider-label-sfast'),

    // Adv Settings
    startSortBtn: document.querySelector('.js--play'),
    stopSortBtn: document.querySelector('.js--stop'),
    playerContainer: document.querySelector('.js--player'),
    inputBlocksNumSlider: document.querySelector('.js--blocks-num-slide'),
    inputBlocksNumText: document.querySelector('.js--blocks-num-text'),
    inputSortingSpeedSlider: document.querySelector('.js--sorting-speed-slide'),
    generateBlocksBtn: document.querySelector('.js--generate-blocks-btn'),
    shuffleBlocksBtn: document.querySelector('.js--shuffle-blocks-btn'),
    inputAnimateCheckbox: document.querySelector('.js--animate'),
    inputSortTypeAscCheckbox: document.querySelector('.js--sort-type-asc'),
    inputSortTypeDesCheckbox: document.querySelector('.js--sort-type-des'),
    inputDisplayHeightsCheckbox: document.querySelector('.js--display-heights'),
    inputMinHeightText: document.querySelector('.js--blocks-min-height-text'),
    inputMinHeightSlider: document.querySelector('.js--blocks-min-height-slide'),
    inputMaxHeightText: document.querySelector('.js--blocks-max-height-text'),
    inputMaxHeightSlider: document.querySelector('.js--blocks-max-height-slide')
};


export const colors = {
    default: '#2B90FE',
    dark: '#141414',
    light: '#2B90FE',
    accent: '#65939c',

    // Sorting:
    highlight: '#8bc4fa',
    chosen: '#e98bfa',
    sorted: 'rgb(31, 111, 197)'

    // default: '#2c3e50',
    // dark: '#2c3e50',
    // light: '#3a536b',
    // accent: '#65939c'
};

export const selectBlock = id => {
    return document.querySelector(`.id-${id}`);
};
