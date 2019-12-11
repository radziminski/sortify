import { selectBlock, colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class Sort {
    constructor(blockWidth, breakPointer) {
        this.breakPointer = breakPointer;
        this.blockWidth = blockWidth;
        this.currentStep = 1;
    }


    //////////////////////////////////////////
    /////////      TIME METHODS:     /////////
    //////////////////////////////////////////

    wait(time, callback = null) {
        return new Promise(async (resolve, reject) => {
            // How many times function wants to wait 100ms:
            const repeatTimes = time / 100;
            // if (callback) callback();
            if (repeatTimes >= 1) {
                // Waiting 100ms x repeatTimes:
                for (let i = 0; i < repeatTimes; i++) {
                    if (this.breakPointer) reject(null);
                    if (this.pausePointer) reject('pause');
                    // Wait 100ms :
                    await this.delay();
                }
                if (callback) callback();
                resolve();
            } else {
                // Function wants  to wait shorter than 100ms:
                if (this.breakPointer) reject(null);
                if (this.pausePointer) reject('pause');
                setTimeout(() => {
                    resolve(true);
                }, time);
            };
        });
    }

    delay(callback = null) {
        return new Promise((resolve, reject) => {
                setTimeout(() => {    
                    resolve(true);
                }, 100);
        });
    }

    //////////////////////////////////////////
    /////////     ARRAY METHODS      /////////
    //////////////////////////////////////////

    arrSwap(arr, indexA, indexB) {
        const temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    }

    findMax(curr, arr) {
        let max = curr;
        for (let i = curr + 1; i < arr.length; i++)
            if (arr[i] > arr[max]) max = i;
        return max;
    };

    findMin(curr, arr) {
        let max = curr;
        for (let i = curr + 1; i < arr.length; i++)
            if (arr[i] < arr[max]) max = i;
        return max;
    };

    //////////////////////////////////////////
    ////////   BLOCKS ASYNC METHODS   ////////
    //////////////////////////////////////////

    blocksSwapAnimation(blockA, blockB, transitionTime) {
        return new Promise(async (resolve, reject) => {
            selectBlock(blockA).classList.remove('animated', 'fadeInUp');
            selectBlock(blockB).classList.remove('animated', 'fadeInUp');
            selectBlock(blockA).style.transition = `transform ${transitionTime/1000}s`;
            selectBlock(blockB).style.transition = `transform ${transitionTime/1000}s`;
            
            await this.wait(10).catch((err) => {
                reject(err);
                return;
            });;

            const distance = (blockB - blockA) * this.blockWidth;
            const blockAPrevMargin = selectBlock(blockA).style.marginBottom;
            const blockBPrevMargin = selectBlock(blockB).style.marginBottom;
            selectBlock(blockA).style.transform = `translate(${distance}px, 0)`;
            selectBlock(blockB).style.transform = `translate(${(-1) * (distance)}px, 0)`;

            await this.wait(1.5 * transitionTime, () => {
                selectBlock(blockA).style.transition = 'background-color 0.2s, transform 0s';
                selectBlock(blockB).style.transition = 'background-color 0.2s, transform 0s';
                selectBlock(blockA).style.transform = 'translate(0, 0)';
                selectBlock(blockB).style.transform = 'translate(0, 0)';
                selectBlock(blockA).style.marginBottom = blockBPrevMargin;
                selectBlock(blockB).style.marginBottom = blockAPrevMargin;

                blocksView.swapBlocksColors(blockA, blockB);
                blocksView.swapBlocksHeight(blockA, blockB);
            })
            .catch((err) => {
                // blocksView.swapBlocksColors(blockA, blockB);
                // blocksView.swapBlocksHeight(blockA, blockB);
                reject(err);
                return;
            });
            resolve(true);
        })
    }


    async lowerBlocks(blocks, waitTime) {
        return new Promise(async (resolve, reject) => {
            
            for (let block in blocks) {
                selectBlock(blocks[block]).classList.remove('animated', 'fadeInUp');
                selectBlock(blocks[block]).style.transition = `background-color 0.2s, margin-bottom ${waitTime/1000}s`;
            }
        
            await this.wait(10).catch((err) => {
                reject(err);
                return;
            });;

            console.log('LOWERING')
            console.log(blocks)
            for (let block in blocks) {
                selectBlock(blocks[block]).style.marginBottom = '0px';
            }

            await this.wait(1.5 * waitTime)
            .catch((err) => {

                reject(err);
                return;
            });

            resolve(true);
        });
    }

    async raiseBlocks(blocks, waitTime) {
        return new Promise(async (resolve, reject) => {
            
            for (let block in blocks) {
                selectBlock(blocks[block]).classList.remove('animated', 'fadeInUp');
                selectBlock(blocks[block]).style.transition = `background-color 0.2s, margin-bottom ${waitTime/1000}s`;
            }
        
            await this.wait(10).catch((err) => {
                reject(err);
                return;
            });;

            for (let block in blocks) {
                selectBlock(blocks[block]).style.marginBottom = '200px';
            }

            await this.wait(1.5 * waitTime)
            .catch((err) => {

                reject(err);
                return;
            });

            resolve(true);
        });
    }
    
    //////////////////////////////////////////
    ///////    SORTING STOP METHODS    ///////
    //////////////////////////////////////////
    
    stop(blocksNum = 0) {
        this.breakPointer = true;
        blocksView.colorAllBlocks(blocksNum);
        this.currentStep = 1;
    }

    pause() {
        this.breakPointer = true;

    }


    //////////////////////////////////////////
    //////   SORTING CONTROL METHODS   ///////
    //////////////////////////////////////////

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

        
        */

        return new Promise(async (resolve, reject) => {
        switch (step) {
            case 0: 
                console.log('step0')
                await this.wait(arg.waitTime)
                .catch(err => {
                    reject(null);
                    return;
                });
                break;

            case 1:
                console.log('step1')
                blocksView.colorSeveralBlocksArr(arg.color, arg.blocks);
                break;
            
            case 2:
                console.log('step2')
                blocksView.colorAllBlocks(arg.blocksNum, arg.color);
                break;

            case 3:
                console.log('step3')
                await this.blocksSwapAnimation(arg.blocks[0], arg.blocks[1], arg.waitTime)
                .catch(err => {
                    reject(null);
                    return;
                });
                break;

            case 4:
                console.log('step4')
                blocksView.swapBlocksHeight(arg.blocks[0], arg.blocks[1]);
                break;
            
            case 5:
                console.log('step5')
                this.arrSwap(arg.sizes, arg.blocks[0], arg.blocks[1]);
                break;
            
            case 6:
                console.log('step6')
                blocksView.swapBlocksColors(arg.blocks[0], arg.blocks[1]);
                break;

            case 7:
                console.log('step7')
                await this.raiseBlocks(arg.blocks, arg.waitTime)
                .catch(err => {
                    reject(null);
                    return;
                });
                break;

            case 8:
                console.log('step8')
                await this.lowerBlocks(arg.blocks, arg.waitTime)
                .catch(err => {
                    reject(null);
                    return;
                });
                break;

            case 9:
                for (block in arg.blocks) {
                    arg.blocks[block] = arg.val[block];
                }
                break;

        };

        await this.wait(20).catch(err => {
            reject(null);
            this.currentStep++;
            return;
        });

        resolve();
        });
    }

    async sortIt(sizes, waitTime, animated = true, sortType = true) {

        // Stopping previous sorting
        this.breakPointer = true;
        await this.delay();
        this.breakPointer = false;

        // Creating steps array
        this.makeSteps(sizes, waitTime, animated, sortType);

        // Executing steps
        let completed = false;
        completed = await this.executeSteps().catch(err => {
            console.log('cought Highest');
            return;
        })


        if (completed) {
            blocksView.colorAllBlocks(sizes.length);
            waitTime > 300 ? await this.wait(waitTime) : await this.wait(250);
            blocksView.colorAllBlocks(sizes.length, 'rgba(0,173,68,1)');
            waitTime > 300 ? await this.wait(waitTime) : await this.wait(400);
            blocksView.colorAllBlocks(sizes.length);
        }

        settingsView.changeToPlayIcon();
    }

    
    async executeSteps() {
        return new Promise(async (resolve, reject) => {
            let i = this.currentStep;
            while (i < this.stepsArr.length) {
                if (this.breakPointer) {
                    reject(false);
                    return;
                } else {
                    this.currentStep = i;
                    await this.stepsDecoder(this.stepsArr[i].stepNum, this.stepsArr[i].arg)
                    .catch(err => {
                        reject(false);
                        return;
                    });
                    i++;
                }
            }
            resolve(true);
        });
    }


}

export default Sort;