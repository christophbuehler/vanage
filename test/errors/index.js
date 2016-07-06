[
    'ActError',
    'DelegationError',
    'RegisterError',
    'ServiceError'
].forEach(function(file) {
    require('./' + file + 'Test.js');
});