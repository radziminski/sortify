import { selectBlock, colors } from '../../base';
import * as blocksView from '../../views/blocksView';
import * as settingsView from '../../views/settingsView';

class Sort {
    constructor(blockWidth, breakPointer, pausePointer) {
        this.breakPointer = breakPointer;
        this.pausePointer = pausePointer;
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
            selectBlock(blockA).style.transform = `translateX(${distance}px)`;
            selectBlock(blockB).style.transform = `translateX(${(-1) * (distance)}px)`;

            await this.wait(transitionTime, () => {
                selectBlock(blockA).style.transition = 'background-color 0.2s, transform 0s';
                selectBlock(blockB).style.transition = 'background-color 0.2s, transform 0s';
                selectBlock(blockA).style.transform = 'none';
                selectBlock(blockB).style.transform = 'none';

                blocksView.swapBlocksColors(blockA, blockB);
                blocksView.swapBlocksHeight(blockA, blockB);
            })
            .catch((err) => {
                blocksView.swapBlocksColors(blockA, blockB);
                blocksView.swapBlocksHeight(blockA, blockB);
                reject(err);
                return;
            });
            resolve(true);
        })
    }

    highlightConsequtiveBlocks(startBlock, endBlock, time, sortType) {
        return new Promise(async (resolve, reject) => {
            let currentBlock = startBlock + 1;
            let currentMaxHeight = selectBlock(startBlock).style.height;
            let currentMaxBlock = startBlock;
            let flag = true;
            let terminate = false;
            await this.wait(time / 2).catch((err) => {
                resolve(err);
                return;
            });

            while (currentBlock <= endBlock && !terminate) {
                let swap = false;
                if (sortType && 
                    parseInt(selectBlock(currentBlock).style.height) > parseInt(currentMaxHeight))
                        swap = true;
                else if (!sortType && 
                    parseInt(selectBlock(currentBlock).style.height) < parseInt(currentMaxHeight))
                        swap = true;

                if (sortType && 
                    parseInt(selectBlock(currentBlock).style.height) > parseInt(currentMaxHeight) ||
                    !sortType && 
                    parseInt(selectBlock(currentBlock).style.height) < parseInt(currentMaxHeight)) {
                        blocksView.colorSingleBlock(currentBlock, colors.highlight);
                        currentMaxHeight = selectBlock(currentBlock).style.height;
                        await this.wait(time / 2, () => {
                            blocksView.colorSingleBlock(currentBlock, colors.chosen);
                            if (!flag) blocksView.colorSingleBlock(currentMaxBlock, colors.default);
                            flag = false;
                            currentMaxBlock = currentBlock;
                        }).catch((err) => {
                            resolve(err);
                            terminate = true;
                            return;
                        });
                        
                        await this.wait(time / 2).catch((err) => {
                            resolve(err);
                            terminate = true;
                            return;
                    });
                } else {
                    blocksView.colorSingleBlock(currentBlock, colors.highlight);
                    await this.wait(time / 2, () => {
                        blocksView.colorSingleBlock(currentBlock, colors.default);
                    }).catch((err) => {
                        resolve(err);
                        terminate = true;
                        return;
                    });
                    
                }
                currentBlock++;
            };
            blocksView.colorSingleBlock(currentBlock - 1, colors.default);
            resolve(currentMaxBlock);
            return;
        })
    }
    
    //////////////////////////////////////////
    /////   SORTING MANAGEMENT METHODS   /////
    //////////////////////////////////////////
    
    stop(blocksNum = 0) {
        this.breakPointer = true;
        blocksNum ? blocksView.colorAllBlocks(blocksNum) : null;
        this.currentStep = 1;
    }

    pause() {
        this.breakPointer = true;
        //for (let block = 0; block < this.sortStep; block++) blocksView.colorSingleBlock(block);
    }

    async stepsDecoder(step, arg) {
        return new Promise(async (resolve, reject) => {
        switch (step) {
            case 0: 
                await this.wait(arg.waitTime)
                .catch(err => {
                    reject(null);
                });
                console.log('step0')
                break;

            case 1:
                blocksView.colorSeveralBlocksArr(arg.color, arg.blocks);
                console.log('step1')
                break;
            
            case 2:
                blocksView.colorAllBlocks(arg.blocksNum, arg.color);
                console.log('step2')
                break;

            case 3:
                await this.blocksSwapAnimation(arg.blocks[0], arg.blocks[1], arg.waitTime)
                .catch(err => {
                    reject(null);
                });
                console.log('step3')
                break;

            case 4:
                blocksView.swapBlocksHeight(arg.blocks[0], arg.blocks[1]);
                console.log('step4')
                break;
            
            case 5:
                this.arrSwap(arg.sizes, arg.blocks[0], arg.blocks[1]);
                console.log('step5')
                break;
        };

        this.delay().catch(err => {
            reject(null);
        });
        resolve();
        });
    }

    async sortIt(sizes, waitTime, animated = true, sortType = true) {
        this.breakPointer = true;
        await this.delay();
        this.breakPointer = false;
        this.pausePointer = false;

        this.makeSteps(sizes, waitTime, sortType);
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
            let cont = true;
            let i = this.currentStep;
            while (i < this.stepsArr.length) {
                if (this.breakPointer) {
                    reject(false);
                    return;
                }
                this.currentStep = i;
                await this.stepsDecoder(this.stepsArr[i].stepNum, this.stepsArr[i].arg)
                .catch(err => {
                    reject(false);
                    return;
                });
                i++;
            }
            resolve(true);
        });
    }


}

export default Sort;