import * as React from 'react';
import { memo, useRef, useState } from 'react';

import {
  Button,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useInlineStyl } from 'react-native-react-styl';

const T: React.FC<{ style: StyleProp<ViewStyle> }> = memo((props) => {
  const f = useRef();
  const styl = useInlineStyl<'t2'>();
  console.log('[App.T]', 'render', props.style, f.current === styl);
  return (
    <View>
      <Text style={props.style}>T1</Text>
      <T2 style={styl('t2', { color: 'purple' })} />
    </View>
  );
});

const T2: React.FC<{ style: StyleProp<ViewStyle> }> = memo((props) => {
  console.log('[App.T2]', 'render', props.style);
  return <Text style={props.style}>t2</Text>;
});

export default function App() {
  const styl = useInlineStyl();
  const [render, setRender] = useState(0);
  const [color, setColor] = useState('green');
  console.log('[App.App]', 'render');

  return (
    <View style={styles.container}>
      {render > 2 && <T style={styl('post', [styles.box, { color }])} />}
      <Text>{render}</Text>
      <Button
        title={'Render'}
        onPress={() => {
          setRender((prev) => prev + 1);
          if (render === 8) {
            setColor('yellow');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
    backgroundColor: 'red',
  },
});
