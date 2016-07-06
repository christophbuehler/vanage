[![Build Status](https://travis-ci.org/janbiasi/vanage.svg?branch=master)](https://travis-ci.org/janbiasi/vanage)
[![Code Climate](https://codeclimate.com/github/janbiasi/vanage/badges/gpa.svg)](https://codeclimate.com/github/janbiasi/vanage)
[![Test Coverage](https://codeclimate.com/github/janbiasi/vanage/badges/coverage.svg)](https://codeclimate.com/github/janbiasi/vanage/coverage)

Handling events in the microservice way without any dependencies, for your Browser and Node.js

### Installation

You can install this package via bower if you're using it in your client or via NPM to use it 
on your server-side. If you're planning to use it on your server and the client install the module 
via NPM to ensure you have the `dist` folder and the whole modular structure.

```bash 
npm install --save vanage
bower install --save vanage
```

##### Compatibility

| Chrome | Firefox | Opera | Safari | Node.js | io.js |
|--------|---------|-------|--------|---------|-------|
| 5+     | 4.0+    | 12+   | 5+     | 4+      | *Not tested* | 

If you want to use it in a browser which isn't supported by the module itself, you can 
add the polyfill from [polyfill.io](https://cdn.polyfill.io/v2/docs) with the small HTML snippet below.

```html
<!doctype html>
<html>
<head></head>
<body>
    ...
    <!-- content -->
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
    <script src="/vendor/vanage/dist/vanage.min.js"></script>
</body>
</html>
``` 

### Usage

```js
const Manager = Vanage.create({
    debug: true
});

Manager.register({
    role: 'user',
    action: 'create'
}, (args, done) => {
    if(args.permission = 'allowed') {
        /* do some stuff with args.data ... */
        return done();
    }

    done(new Error('Access denied'));
});


let permission = $.get('/api/v1/getPermission');

Manager.act({
    role: 'user',
    action: 'create'
}, {
    permission: await permission,
    data: { /* user data */ }
}, err => {
    if(err) {
        alert(err.message);
        return false;
    }

    alert('User created!');
});
```

### License
[Apache 2.0 - OpenSource](LICENSE)