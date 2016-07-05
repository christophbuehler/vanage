[
    'ActError',
    'DelegationError',
    'RegisterError'
].forEach(function(file) {
    require('./' + file + 'Test.js');
});