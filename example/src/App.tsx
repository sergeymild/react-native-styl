import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { styl } from 'react-native-react-styl';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styl([{ color: 'red' }])}>Res</Text>
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
  },
});
