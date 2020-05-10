# Sortify
Web application visualizing different sorting algorithms. It displays animations of sorting the rectangular blocks with different heights. Current version supports: bubble sort, selection sort, insert sort, quick sort and merge sort.
## Getting started
### Instalation
Use [npm](https://www.npmjs.com/) package menager to install this app.
```bash
git clone https://github.com/radziminski/sortify
npm install
```
### Usage
To run application use 
```bash
npm start
```
or go to [Sortify website](https://radziminski.github.io/sortify)
#### Website Layout:
![layout](https://i.ibb.co/MCQnfTY/sortify.png)
1. Green section
    - In this section the animation will be shown. Please note that animations are performed using CSS and vanilla Javascript, so they may behave differently in different internet browsers.
2. Blue section
    - Here user can play/pause or stop current animation. There are also visible some statistic about current sort algorithm performance - on the left there are comparisons counted up to a given point during sorting and on the right is theoretical complexity for given algorithm calculated for current number of blocks
3. Pink section
    - With usage of this toolbar, user may select current sorting algorithm, by simply clicking proper button. Note, that after algorithm change, the current sorting animation will be stopped. 
4. Purple section
    - These are settings that allow to control the operation of appliaction. Settings are divided into two columns: Blocks settings, where user may change number of blocks, their minimal and maximum height and shuffle or generate new blocks. In Sorting settings, user may change the speed of the animation, sorting type (ascending or descending) and smoothness of animation with "animated" toggle button - with this turned off the animations visibility will be reduced to minimum. 
#### Important remark:
Application may behave wrongly in "fast" speed of sorting - due to very little times between given sorting steps, some of them might be performed in wrong order, crashing the animation. 
Therefore, instant, normal or slower speed is recomended. 
## Built With
- Html and CSS
- Vanilla javascript with Babel compiler 
- SASS preprocessor
- Animations were done only in CSS
- Webpack used for bundling
- Deployed on [GithubPages](https://radziminski.github.io/sortify)

## License
This project is licensed under the MIT License.
