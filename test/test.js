Service.register({
    module: 'appcache',
    event: 'ready'
}, (args, done) => {
    if(args.state === 3) { // updateready
        done(null, window.applicationCache);
    } else {
        done(new Error('Appcache status is not updateready!'));
    }
});

Service.act({
    module: 'appcache',
    event: 'ready'
}, {
    state: window.applicationCache.UPDATEREADY
}, (err, result) => {
    if(err) {
        console.error(err.message);
        return false;
    }

    if(confirm('Cache is updateready, swap and reload?')) {
        result.swap();
        window.location.reload();
    }
});

Service.delegate({
    module: 'appcache',
    event: 'ready'
}, (err, result, delegate) => {
    delegate({
        module: 'appcache',
        event: err ? 'error' : 'swap'
    }, result);
});