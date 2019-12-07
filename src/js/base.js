export const DOMelements = {
    blocks: document.querySelector('.section-blocks'),
    blocksList: document.querySelector('.section-blocks__list'),

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

    // Adv Settings
    startSortBtn: document.querySelector('.js--play'),
    stopSortBtn: document.querySelector('.js--stop'),
    playerContainer: document.querySelector('.js--player'),
    inputBlocksNumSlider: document.querySelector('.js--blocks-num-slide'),
    inputBlocksNumText: document.querySelector('.js--blocks-num-text'),
    inputSortingSpeedSlider: document.querySelector('.js--sorting-speed-slide'),
    inputSortingSpeedText: document.querySelector('.js--sorting-speed-text'),
    generateBlocksBtn: document.querySelector('.js--generate-blocks-btn'),
    shuffleBlocksBtn: document.querySelector('.js--shuffle-blocks-btn'),
    inputAnimateCheckbox: document.querySelector('.js--animate'),
    inputSortTypeCheckbox: document.querySelector('.js--sort-type'),
    inputDisplayHeightsCheckbox: document.querySelector('.js--display-heights'),
}

export function highlightSortingBtn(btn) {
    const allBtns = DOMelements.allSortingBtns;
    for (let i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove('btn--active');
    };
    btn.classList.add('btn--active');
}

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
}

export const selectBlock = id => {
    return document.querySelector(`.id-${id}`);
}

export const animateCSS = (element, animationName, callback) => {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}