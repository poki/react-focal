# react-focal

`react-focal` helps users define the focal point of their images. This allows
the developer to create suitable crops for all kinds of resolutions which will
always be centered around the subject of any image.


## Usage

`react-focal` can be found on [npm][npm], so to install it, run:

```bash
$ npm install --save react-focal
```

Once it's installed you can use it as such:

```jsx
import React from 'react';
import Focal from 'react-focal';

export default function MyComponent() {
  return (
    <Focal
      width={640}
      height={480}
    />
  );
}
```

This will render the most basic instance of Focal which doesn't really do much.
It becomes more interesting when you add an `onChange` handler to the component.

```jsx
import Focal from 'react-focal';

export default class MyComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      x: 50,
      y: 50,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(x, y) {
    this.setState({ x, y });
  }

  render() {
    return (
      <div>
        <Focal
          width={640}
          height={480}
          onChange={this.onChange}
        />
        <input type="hidden" name="x" value={this.state.x} />
        <input type="hidden" name="y" value={this.state.y} />
      </div>
    );
  }
}
```

The above example updates two hidden inputs with the new focal point coordinates
every time they change. You could do something like this, or similar, in order
to store the focal point in your database and then make custom crops as
required.

[npm]: https://www.npmjs.com/


## License

MIT © [Poki BV](http://poki.com/company/)
