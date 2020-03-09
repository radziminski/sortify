const first = () => {
        console.log('First');
        setTimeout(() => {
            return true;
        }, 1000)
};

const second = async () => {
    await first();
    await first();
    return new Promise(resolve => {
        console.log('second');
        setTimeout(() => {
            console.log('third');
            resolve();
        }, 500)
    })
};

const third = async () => {
    let err = [false];
    
    await first();

    return false;

}

//third();

const forth = async () => {
    await third();
    await first();
    return false;
}

forth().then(res => console.log(res))