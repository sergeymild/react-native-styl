import * as React from 'react';
import { memo, useState } from 'react';

import {
  Button,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

const T: React.FC<{ style: StyleProp<ViewStyle> }> = memo((props) => {
  console.log('[App.T]', 'render', props.style);
  return (
    <View>
      <Text style={props.style}>T1</Text>
    </View>
  );
});

const T2: React.FC<{ style: StyleProp<ViewStyle> }> = memo((props) => {
  console.log('[App.T2]', 'render', props.style);
  return <Text style={props.style}>t2</Text>;
});

export default function App() {
  const [render, setRender] = useState(0);
  const [color, setColor] = useState('green');

  return (
    <View style={styles.container}>
      {render > 2 && <T style={[styles.box, styles.box]} />}

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
