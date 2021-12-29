# react-native-react-styl

React Native inline styles memo
Memoize inline styles passed to components.

## Installation

```sh
npm install react-native-react-styl
```

## Usage

```js
import { useInlineStyl } from 'react-native-react-styl';

// ...
const App: React.FC = () => {
  const styl = useInlineStyl<'title' | 'subtitle'>()

  return (
    <>
      <Text style={styl('title', [{ color: 'red' }])}>Title</Text>
      <Text style={styl('subtitle', [{ color: 'yellow' }])}>Title</Text>
    </>
  )
}
```
