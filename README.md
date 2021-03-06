[![Build Status](https://travis-ci.org/janbiasi/vanage.svg?branch=master)](https://travis-ci.org/janbiasi/vanage)
[![Code Climate](https://codeclimate.com/github/janbiasi/vanage/badges/gpa.svg)](https://codeclimate.com/github/janbiasi/vanage)
[![Test Coverage](https://codeclimate.com/github/janbiasi/vanage/badges/coverage.svg)](https://codeclimate.com/github/janbiasi/vanage/coverage)

Handling events in the microservice way without any dependencies, for your Browser and Node.js 

## Installation

You can install this package via bower if you're using it in your client or via NPM to use it 
on your server-side. If you're planning to use it on your server and the client install the module 
via NPM to ensure you have the `dist` folder and the whole modular structure.

```bash 
npm install --save vanage
bower install --save vanage
```

#### Compatibility

| Chrome | Firefox | Opera | Safari | Node.js | io.js |
|--------|---------|-------|--------|---------|-------|
| 5+     | 4.0+    | 12+   | 5+     | 4       | *-'** |

* *-* = not tested yet 

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

## ToDo's

- [ ] Adding the method API to Readme
- [ ] Create API docs out of the Readme content
- [ ] Adding async possibility to all methods
- [ ] Check compatibility with Node.js v5 and v6
- [ ] Improve code quality and test coverage

## Usage

> You can **try vanage** in your browser with a live example with [Tonic Dev](https://tonicdev.com/janbiasi/vanage-example)

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

## API

### Vanage

#### Properties

##### Cache

##### Service

#### Methods

##### create


### Service

#### Methods

##### register

Registers a new endpoint for an actor or arbitrator, specified by a certain factory and internal signature.

| Number | Parameter | Type     | Signature |
|--------|-----------|----------|-----------|
| 1      | params    | Object   | -         |
| 2      | done      | Function | (error: Error|null, result?: Any) |
| 3      | delegate  | Function | (target: Object, data?: Any, done?: Function) |

```js
service.register({
    any: 'key',
    to: 'identify'
}, (params, done, delegate) => {
    return done(null, params);
});
```

##### unregister

Will unregister a specific endpoint by passing a signature object into the unregister method. A signature 
can be received by the register method. It will return a boolean which represents the internal result of the method, 
while true means the unregistration process was successfull and false means there was no handler or delegate found with 
this signature.

| Number | Parameter | Type        |
|--------|-----------|-------------|
| 1      | sign      | Signature   |

```js
var sign = service.register({}, /* ... */);
service.unregister(sign);
```

##### delegate 

##### act

Executes a certain factory and handles the result of the registered process. You can also delegate to another target, 
for example depending on the result.

| Number | Parameter | Type     | Signature |
|--------|-----------|----------|-----------|
| 1      | err       | Any      | -         |
| 2      | results   | Any      | - |
| 3      | delegate  | Function | (target: Object, data?: Any, done?: Function) |

```js
service.act({
    any: 'key',
    to: 'identify'
}, (err, results, delegate) => {
    if(err) {
        return delegate({
            handle: 'error'
        }, { failed: err });
    }

    $.get(results.apiUrl + '/users', res => {
        // do something with the results
    });
});
```

##### queue


### Cache

#### Properties

##### size

##### entries

#### Methods

##### set

##### get

##### flush

##### dump

##### isDirty


### Pattern

#### Properties

##### id

##### signature

#### Methods

##### match


### Signature

#### Properties

##### identifier

##### identifierKeys

##### unique

##### value

#### Methods

##### match



## License

[Apache 2.0 - OpenSource](LICENSE)