module.exports = () => {
    if(typeof console !== undefined) {
        return console;
    } else if (process && typeof process.stdout.write === 'function') {
        return process.stdout;
    }
};