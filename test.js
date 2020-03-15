const first = () => {
    console.log('First');
    setTimeout(() => {
        return true;
    }, 1000);
};

const second = async () => {
    await first();
    await first();
    return new Promise(resolve => {
        console.log('second');
        setTimeout(() => {
            console.log('third');
            resolve();
        }, 500);
    });
};

const third = async () => {
    let err = [false];

    await first();

    return false;
};

//third();

const forth = async () => {
    await third();
    await first();
    return false;
};

forth().then(res => console.log(res));

const object = () => {
    return {
        lalala: 3,
        func: () => console.log(this)
    };
};

//object.prototype.funcTwo = () => console.log(this);

function gradient(startColor, endColor, steps) {
    var start = {
        Hex: startColor,
        R: parseInt(startColor.slice(1, 3), 16),
        G: parseInt(startColor.slice(3, 5), 16),
        B: parseInt(startColor.slice(5, 7), 16)
    };
    var end = {
        Hex: endColor,
        R: parseInt(endColor.slice(1, 3), 16),
        G: parseInt(endColor.slice(3, 5), 16),
        B: parseInt(endColor.slice(5, 7), 16)
    };
    const diffR = end['R'] - start['R'];
    const diffG = end['G'] - start['G'];
    const diffB = end['B'] - start['B'];

    const stepsHex = new Array();
    const stepsR = new Array();
    const stepsG = new Array();
    const stepsB = new Array();

    for (var i = 0; i <= steps; i++) {
        stepsR[i] = start['R'] + (diffR / steps) * i;
        stepsG[i] = start['G'] + (diffG / steps) * i;
        stepsB[i] = start['B'] + (diffB / steps) * i;
        stepsHex[i] =
            '#' +
            Math.round(stepsR[i]).toString(16) +
            (Math.round(stepsR[i]).toString(16).length === 1 ? Math.round(stepsR[i]).toString(16) : '') +
            Math.round(stepsG[i]).toString(16) +
            (Math.round(stepsG[i]).toString(16).length === 1 ? Math.round(stepsG[i]).toString(16) : '') +
            Math.round(stepsB[i]).toString(16) + 
            (Math.round(stepsB[i]).toString(16).length === 1 ? Math.round(stepsB[i]).toString(16) : '');
    }
    return stepsHex;
}

// WRONG!
function switchTest(key) {
    switch (key) {
        case (1 || 'a'):
            console.log('first')
            break;
        case (2 || 'b'):
            console.log('second');
            break;
        default:
            console.log('none')
            break;
    }
}

const time = setTimeout(() => {
    console.log('cleared');
}, 2000);


const destrTest = (arr) => {
    return [arr, arr.length];
}

let x = [1, 2, 3, 4 ,5]
let y, ysize;
[y, ysize] = destrTest(x);
console.log(y)
console.log(ysize)


