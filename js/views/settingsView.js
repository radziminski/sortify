import { DOMelements } from "../base";

export const togglePlayIcon = () => {
    let curr = DOMelements.startSortBtn.name;
    if (curr !== 'play') {
        DOMelements.startSortBtn.name = 'play';
        return false;
    }
    DOMelements.startSortBtn.name = 'pause';
    return true;
}

export const changeToPlayIcon = () => {
    DOMelements.startSortBtn.name = 'play';
}

export const changeToPauseIcon = () => {
    DOMelements.startSortBtn.name = 'pause';
}