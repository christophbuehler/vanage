module.exports = input => {
    if(typeof input === 'string') {
        return input;
    } else if (Array.isArray(input)) {
        return input.join(', ');
    } else if (input.toISOString !== undefined) {
        return input.toISOString();
    }

    return JSON.stringify(input);
}