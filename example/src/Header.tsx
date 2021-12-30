import React, { memo } from 'react';
import { Text, TextStyle } from 'react-native';

export const Header: React.FC<{ style: TextStyle }> = memo((props) => {
  console.log('[Header.Header]');
  return <Text style={[{ color: 'purple' }, props.style]}>TEx</Text>;
});
