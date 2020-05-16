import { selectBlock, colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class Sort {
    constructor(blockWidth, breakPointer) {
        this.breakPointer = breakPointer; // Flag used to stop sorting
        this.blockWidth = blockWidth; // Width of the block used to calculate block moving animations
        this.currentStep = 1; // Step counter indicating which step from steps array we are in
        this.timeout = null;
        this.stepsArr = [];
    }

    //////////////////////////////////////////
    ///////    VIRTUAL  METHODS:       ///////
    //////////////////////////////////////////

    instantSort(sizes, sortType) {
        console.error('This should be overwriten');
    }

    //////////////////////////////////////////
    /////////      TIME METHODS:     /////////
    //////////////////////////////////////////

    // Method used to simulate animations - wait before each sorting step
    wait(time, callback = null) {
        return new Promise((resolve, reject) => {
            if (this.breakPointer) reject(null);
            this.timeout = setTimeout(() => {
                if (callback) callback();
                resolve(true);
            }, time);
        });
    }

    delay(callback = null) {
        return new Promise((resolve) => {
            this.timeout = setTimeout(() => {
                if (callback) callback();
                resolve(true);
            }, 100);
        });
    }

    //////////////////////////////////////////
    //////////  STATE UPDT METHODS   /////////
    //////////////////////////////////////////

    updateBlockWidth(blockWidth) {
        this.stop();
        this.blockWidth = blockWidth;
    }

    //////////////////////////////////////////
    /////////     ARRAY METHODS      /////////
    //////////////////////////////////////////

    arrSwap(arr, indexA, indexB) {
        [arr[indexA], arr[indexB]] = [arr[indexB], arr[indexA]];
    }

    findMax(curr, arr) {
        let max = curr;
        for (let i = curr + 1; i < arr.length; i++) if (arr[i] > arr[max]) max = i;
        return max;
    }

    findMin(curr, arr) {
        let max = curr;
        for (let i = curr + 1; i < arr.length; i++) if (arr[i] < arr[max]) max = i;
        return max;
    }

    //////////////////////////////////////////
    ////////   BLOCKS ASYNC METHODS   ////////
    //////////////////////////////////////////

    // Animation of two blocks swapping
    async blocksSwapAnimation(blockA, blockB, transitionTime) {
        // Removing classess added for initial animations (after generating the blocks)
        blocksView.turnOffAnimation(blockA);
        blocksView.turnOffAnimation(blockB);

        // Setting up transition of transform property to the general time of sorting
        blocksView.setTransitionTime(blockA, transitionTime);
        blocksView.setTransitionTime(blockB, transitionTime);

        // Waiting moment to make sure that above steps are done
        try {
            await this.wait(10);
        } catch (err) {
            throw new Error(err);
        }

        // Saving if blocks were not moved up eariler
        const blockAPrevMargin = selectBlock(blockA).style.marginBottom;
        const blockBPrevMargin = selectBlock(blockB).style.marginBottom;

        // Calculating distance in pixels for which blocks will be transformed
        const distance = (blockB - blockA) * this.blockWidth;

        // Visualizing swapping blocks animation
        blocksView.moveBlockHorizontal(blockA, distance);
        blocksView.moveBlockHorizontal(blockB, -distance);

        try {
            await this.wait(1100 * blocksView.convertTransitionTimeToMs(transitionTime), () => {
                // Reseting all transition times at end, so the blocks can be actually swapped
                // without showing weird jumps to the user
                blocksView.clearTransitionTime(blockA);
                blocksView.clearTransitionTime(blockB);
                blocksView.moveBlockHorizontal(blockA, 0);
                blocksView.moveBlockHorizontal(blockB, 0);

                selectBlock(blockA).style.marginBottom = blockBPrevMargin;
                selectBlock(blockB).style.marginBottom = blockAPrevMargin;

                // Swapping blocks heights and their colors
                blocksView.swapBlocksColors(blockA, blockB);
                blocksView.swapBlocksHeight(blockA, blockB);
            });
            await this.delay();
        } catch (error) {
            throw new Error(error);
        }

        // Restoring original blocks transition times
        blocksView.setTransitionTime(blockA, 200);
        blocksView.setTransitionTime(blockB, 200);

        return true;
    }

    // Method used to lower the block after it was moved up eariler
    async lowerBlocks(blocks, waitTime) {
        // Adding margin transition so the block is moved up smoothly (margin-bottom will be added to it)
        for (let block in blocks) {
            blocksView.turnOffAnimation(blocks[block]);
            blocksView.setTransitionTime(blocks[block], waitTime);
        }
        try {
            await this.wait(10);
            for (let block in blocks) {
                blocksView.moveBlockVertical(blocks[block], 0);
            }
            await this.wait(1.5 * waitTime);
        } catch (error) {
            throw new Error(error);
        }

        // Assinging margin bottom property for all blocks

        return true;
    }

    // Method used to raise (move up) given blocks, analogicly to lowerBlocks()
    async raiseBlocks(blocks, waitTime) {
        for (let block in blocks) {
            blocksView.turnOffAnimation(blocks[block]);
            blocksView.setTransitionTime(blocks[block], waitTime);
        }

        try {
            await this.wait(10);
            for (let block in blocks) blocksView.moveBlockVertical(blocks[block], 200);
            await this.wait(1.5 * waitTime);
        } catch (error) {
            throw new Error(error);
        }

        return true;
    }

    //////////////////////////////////////////
    ///////    SORTING STOP METHODS    ///////
    //////////////////////////////////////////

    // Function stopping sorting and reseting all properties
    stop(blocksNum = 0) {
        this.breakPointer = true;
        clearTimeout(this.timeout);
        blocksView.colorAllBlocks(blocksNum);
        blocksView.clearRaiseBlocks(blocksNum);
        this.currentStep = 1;
        settingsView.changeToPlayIcon();
    }

    // Fucntion only stopping sorting so it can be continued later
    pause() {
        this.breakPointer = true;
        clearTimeout(this.timeout);
        this.step--;
        //if (sizes) blocksView.renderBlocks(sizes, this.blockWidth, false);
    }

    //////////////////////////////////////////
    //////   SORTING CONTROL METHODS   ///////
    //////////////////////////////////////////

    // Steps creation
    addStep(stepID, args, animated = true) {
        this.stepsArr.push({
            stepNum: stepID,
            arg: args,
        });
    }

    // Method that perform given step (According to step list below) from the steps array
    async stepsDecoder(step, arg, animated = true) {
        /* STEPS:
            0: wait some time 
                arg:    waitTime
    
            1: color several blocks 
                arg:    color
                arg:    blocks[]
    
            2:  color all blocks
                arg:    color
                arg:    blocksnum
    
            3:  block swap animation
                arg:    blocks[]
                arg:    waitTime
    
            4:  swap blocks height
                arg:    blocks[]
    
            5:  arr swap
                arg:    sizes
                arg:    blocks[]
    
            6:  swap blocks colors
                arg:    blocks[]
    
            7: raise block
                arg:    blocks
                arg;    waitTime
            
            8: lower block
                arg:    blocks
                arg;    waitTime
            
            9: set blocks height
                arg:    blocks[]
                values: val[] 
    
            10: increment comparisons num
                arg: -
        */
        try {
            switch (step) {
                case 0:
                case 'wait':
                    await this.wait(arg.waitTime);
                    break;

                case 1:
                case 'colorBlocks':
                    blocksView.colorSeveralBlocksArr(arg.color, arg.blocks);
                    break;

                case 2:
                case 'colorAllBlocks':
                    blocksView.colorAllBlocks(arg.blocksNum, arg.color);
                    break;

                case 3:
                case 'swapAnimation':
                    if (!animated) {
                        blocksView.swapBlocksHeight(arg.blocks[0], arg.blocks[1]);
                        await this.wait(arg.waitTime / 2);
                        return;
                    }
                    await this.blocksSwapAnimation(arg.blocks[0], arg.blocks[1], arg.waitTime);
                    break;

                case 4:
                case 'swapHeight':
                    blocksView.swapBlocksHeight(arg.blocks[0], arg.blocks[1]);
                    break;

                case 5:
                case 'arrSwap':
                    this.arrSwap(arg.sizes, arg.blocks[0], arg.blocks[1]);
                    break;

                case 6:
                case 'swapColors':
                    blocksView.swapBlocksColors(arg.blocks[0], arg.blocks[1]);
                    break;

                case 7:
                case 'raiseBlocks':
                    if (!animated) return;
                    await this.raiseBlocks(arg.blocks, arg.waitTime);
                    break;

                case 8:
                case 'lowerBlocks':
                    if (!animated) return;
                    await this.lowerBlocks(arg.blocks, arg.waitTime);
                    break;

                case 9:
                case 'setHeight':
                    for (let block in arg.blocks) {
                        arg.blocks[block] = arg.val[block];
                    }
                    break;
                case 10:
                case 'updtComparisons':
                    if (!arg.num) settingsView.incrementComparisonsNum();
                    else settingsView.addToComparisonNum(arg.num);
                    break;
                default:
                    console.error('Error, step not found!');
                    console.error('Step: ' + step);
                    break;
            }
        } catch (error) {
            throw new Error(error);
        }

        try {
            await this.wait(20);
        } catch (error) {
            this.currentStep++;
            throw new Error(error);
        }

        return true;
    }

    async clearPrevSort() {
        settingsView.resetComparisonsNum();
        this.breakPointer = true;
        await this.delay();
        this.breakPointer = false;
    }

    async sortItInstantSort(sizes, sortType) {
        const comparisons = this.instantSort(sizes, sortType);
        blocksView.renderBlocks(sizes, this.blockWidth, true);
        settingsView.changeToPlayIcon();
        blocksView.toggleBlocksHeight(sizes.length, 0);
        this.stop(sizes.length);
        settingsView.setComparisonNum(comparisons);
        return true;
    }

    async sortCompletedAnimation(sizesLength, waitTime) {
        blocksView.colorAllBlocks(sizesLength);
        waitTime > 300 ? await this.wait(waitTime) : await this.wait(250);
        blocksView.colorAllBlocks(sizesLength, 'rgba(0,173,68,1)');
        waitTime > 300 ? await this.wait(waitTime) : await this.wait(400);
        blocksView.colorAllBlocks(sizesLength);
    }

    // Method initializing and performing whole sort animation
    async sortIt(sizes, waitTime, animated = true, sortType = true) {
        // Stopping previous sorting
        await this.clearPrevSort();
        // Instant sorting if time is 0 (or almost 0)
        if (waitTime < 10) return await this.sortItInstantSort(sizes, sortType);

        if (waitTime < 50) {
            blocksView.disableTransition(sizes.length);
        } else {
            blocksView.enableTransition(sizes.length);
        }

        // Creating steps array
        if (this.currentStep === 1) this.makeSteps(sizes, waitTime, sortType);

        // Executing steps (from steps array)
        let completed = false;
        try {
            completed = await this.executeSteps(animated);
        } catch (error) {
            return false;
        }

        // Fnalizing animation with flash of green coloring
        if (completed) await this.sortCompletedAnimation(sizes.length, waitTime);

        this.stop(sizes.length);
        return true;
    }

    // Fucntion iterating thorugh steps array and executing each step
    async executeSteps(animated = true) {
        let i = this.currentStep;

        while (i < this.stepsArr.length) {
            if (this.breakPointer) {
                return false;
            } else {
                this.currentStep = i;

                try {
                    await this.stepsDecoder(this.stepsArr[i].stepNum, this.stepsArr[i].arg, animated);
                } catch (error) {
                    throw new Error(error);
                }

                i++;
            }
        }
        return true;
    }
}

export default Sort;
