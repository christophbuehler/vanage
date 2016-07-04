const guidBlock = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
};

module.exports = function guid() {
    return guidBlock() + guidBlock() + '-' + guidBlock() + '-' + guidBlock() + '-' +
        guidBlock() + '-' + guidBlock() + guidBlock() + guidBlock();
}