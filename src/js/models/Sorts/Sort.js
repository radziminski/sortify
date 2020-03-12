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
        console.log('This should be overwriten');
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
        return new Promise(resolve => {
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
        console.log('Swapping blocks: ' + blockA + 'and ' + blockB);

        let transitionTimeInSeconds = Math.round(transitionTime / 10) / 100;
        if (transitionTimeInSeconds === 0) transitionTimeInSeconds = 0.1;
        // Removing classess added for initial animations (after generating the blocks)
        selectBlock(blockA).classList.remove('animated', 'fadeInUp');
        selectBlock(blockB).classList.remove('animated', 'fadeInUp');

        // Setting up transition of transform property to the general time of sorting
        selectBlock(blockA).style.transition = `transform ${transitionTimeInSeconds}s`;
        selectBlock(blockB).style.transition = `transform ${transitionTimeInSeconds}s`;

        // Waiting moment to make sure that above steps are done
        await this.wait(10).catch(err => {
            throw new Error(err);
        });

        // Calculating distance in pixels for which blocks will be transformed
        const distance = (blockB - blockA) * this.blockWidth;

        // Checking if blocks were not moved up eariler
        const blockAPrevMargin = selectBlock(blockA).style.marginBottom;
        const blockBPrevMargin = selectBlock(blockB).style.marginBottom;

        // Visualizing swapping blocks animation
        selectBlock(blockA).style.transform = `translate(${distance}px, 0)`;
        selectBlock(blockB).style.transform = `translate(${-1 * distance}px, 0)`;

        await this.wait(1100 * transitionTimeInSeconds, () => {
            // Reseting all transition times at end, so the blocks can be actually swapped
            // without showing weird jumps to the user
            selectBlock(blockA).style.transition = 'background-color 0.0s, transform 0s';
            selectBlock(blockB).style.transition = 'background-color 0.0s, transform 0s';
            selectBlock(blockA).style.transform = 'translate(0, 0)';
            selectBlock(blockB).style.transform = 'translate(0, 0)';
            selectBlock(blockA).style.marginBottom = blockBPrevMargin;
            selectBlock(blockB).style.marginBottom = blockAPrevMargin;

            // Swapping blocks heights and their colors
            blocksView.swapBlocksColors(blockA, blockB);
            blocksView.swapBlocksHeight(blockA, blockB);
        }).catch(err => {
            // blocksView.swapBlocksColors(blockA, blockB);
            // blocksView.swapBlocksHeight(blockA, blockB);
            throw new Error(err);
        });

        await this.delay().catch(err => {
            throw new Error(err);
        });

        // Restoring original blocks transition times
        selectBlock(blockA).style.transition = 'background-color 0.2s, transform 0s';
        selectBlock(blockB).style.transition = 'background-color 0.2s, transform 0s';

        return true;
    }

    // Method used to lower the block after it was moved up eariler
    async lowerBlocks(blocks, waitTime) {
        // Adding margin transition so the block is moved up smoothly (margin-bottom will be added to it)
        for (let block in blocks) {
            selectBlock(blocks[block]).classList.remove('animated', 'fadeInUp');
            selectBlock(
                blocks[block]
            ).style.transition = `background-color 0.2s, margin-bottom ${waitTime / 1000}s`;
        }

        await this.wait(10).catch(err => {
            throw new Error(err);
        });


        // Assinging margin bottom property for all blocks
        for (let block in blocks) {
            selectBlock(blocks[block]).style.marginBottom = '0px';
        }

        await this.wait(1.5 * waitTime).catch(err => {
            throw new Error(err);
        });

        return true;
    }

    // Method used to raise (move up) given blocks, analogicly to lowerBlocks()
    async raiseBlocks(blocks, waitTime) {
        for (let block in blocks) {
            selectBlock(blocks[block]).classList.remove('animated', 'fadeInUp');
            selectBlock(
                blocks[block]
            ).style.transition = `background-color 0.2s, margin-bottom ${waitTime / 1000}s`;
        }

        await this.wait(10).catch(err => {
            throw new Error(err);
        });

        for (let block in blocks) selectBlock(blocks[block]).style.marginBottom = '200px';

        await this.wait(1.5 * waitTime).catch(err => {
            throw new Error(err);
        });

        return true;
    }

    //////////////////////////////////////////
    ///////    SORTING STOP METHODS    ///////
    //////////////////////////////////////////

    // Function stopping sorting and reseting all properties
    stop(blocksNum = 0) {
        console.log('started stopping')
        this.breakPointer = true;
        clearTimeout(this.timeout);
        blocksView.colorAllBlocks(blocksNum);
        blocksView.clearRaiseBlocks(blocksNum);
        settingsView.resetComparisonsNum();
        this.currentStep = 1;
        console.log('finished stopping');
    }

    // Fucntion only stopping sorting so it can be continued later
    pause(sizes = null) {
        this.breakPointer = true;
        clearTimeout(this.timeout);
        this.step--;
        //if (sizes) blocksView.renderBlocks(sizes, this.blockWidth, false);
    }

    //////////////////////////////////////////
    //////   SORTING CONTROL METHODS   ///////
    //////////////////////////////////////////

    // Steps creation
    addStep(stepID, args) {
        this.stepsArr.push({
            stepNum: stepID,
            arg: args
        });
    }

    // Method that perform given step (According to step list below) from the steps array
    async stepsDecoder(step, arg) {
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

        switch (step) {
            case 0:
            case 'wait':
                await this.wait(arg.waitTime).catch(err => {
                    throw new Error(err);
                });
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
                await this.blocksSwapAnimation(arg.blocks[0], arg.blocks[1], arg.waitTime).catch(
                    err => {
                        throw new Error(err);
                    }
                );
                break;

            case 4:
            case 'swapHeight':
                blocksView.swapBlocksHeight(arg.blocks[0], arg.blocks[1]);
                break;

            case 5 :
            case 'arrSwap':
                this.arrSwap(arg.sizes, arg.blocks[0], arg.blocks[1]);
                break;

            case 6 :
            case 'swapColors':
                blocksView.swapBlocksColors(arg.blocks[0], arg.blocks[1]);
                break;

            case 7 :
            case 'raiseBlocks':
                await this.raiseBlocks(arg.blocks, arg.waitTime).catch(err => {
                    throw new Error(err);
                });
                break;

            case 8 :
            case 'lowerBlocks':
                await this.lowerBlocks(arg.blocks, arg.waitTime).catch(err => {
                    throw new Error(err);
                });
                break;

            case 9 :
            case 'setHeight':
                for (let block in arg.blocks) {
                    arg.blocks[block] = arg.val[block];
                }
                break;
            case 10 :
            case 'updtComparisons':
                if (!arg.num)
                    settingsView.incrementComparisonsNum();
                else 
                    settingsView.addToComparisonNum(arg.num);
                break;
            default:
                console.error('Error, step not found!');
                console.error('Step: ' + step);
                break;
        }

        await this.wait(20).catch(() => {
            this.currentStep++;
            throw new Error();
        });

        return true;
    }

    // Method initializing and performing whole sort animation
    async sortIt(sizes, waitTime, animated = true, sortType = true) {
        // Stopping previous sorting
        this.breakPointer = true;
        await this.delay();
        this.breakPointer = false;

        // Instant sorting if time is 0 (or almost 0)
        if (waitTime < 10) {
            this.instantSort(sizes, sortType);
            blocksView.renderBlocks(sizes, this.blockWidth, true);
            settingsView.changeToPlayIcon();
            blocksView.toggleBlocksHeight(sizes.length, 0);

            return true;
        }

        if (waitTime < 50) {
            blocksView.disableTransition(sizes.length);
        } else {
            blocksView.enableTransition(sizes.length);
        }

        // Creating steps array
        if (this.currentStep === 1) this.makeSteps(sizes, waitTime, animated, sortType);

        // Executing steps (from steps array)
        let completed = false;
        completed = await this.executeSteps().catch(err => {
            console.log('cought Highest');
            console.log(err)
            return false;
        });

        // Fnalizing animation with flash of green coloring
        if (completed) {
            blocksView.colorAllBlocks(sizes.length);
            waitTime > 300 ? await this.wait(waitTime) : await this.wait(250);
            blocksView.colorAllBlocks(sizes.length, 'rgba(0,173,68,1)');
            waitTime > 300 ? await this.wait(waitTime) : await this.wait(400);
            blocksView.colorAllBlocks(sizes.length);
        }

        settingsView.changeToPlayIcon();
        return true;
    }

    // Fucntion iterating thorugh steps array and executing each step
    async executeSteps() {
        let i = this.currentStep;

        while (i < this.stepsArr.length) {
            if (this.breakPointer) {
                return false;
            } else {
                this.currentStep = i;
                console.log('current step: ' + i)
                console.log(this.stepsArr[i].stepNum);
                await this.stepsDecoder(this.stepsArr[i].stepNum, this.stepsArr[i].arg).catch(
                    err => {
                        throw new Error(err);
                    }
                );
                i++;
            }
        }
        return true;
    }
}

export default Sort;
