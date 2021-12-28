import { useRef } from 'react';
import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

type Style = StyleProp<ViewStyle | TextStyle | ImageStyle>;

function countProps(obj: any) {
  let count = 0;
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) count++;
  }
  return count;
}

function objectEquals(v1: any, v2: any) {
  if (typeof v1 !== typeof v2) {
    return false;
  }

  if (typeof v1 === 'function') {
    return v1.toString() === v2.toString();
  }

  if (v1 instanceof Object && v2 instanceof Object) {
    if (countProps(v1) !== countProps(v2)) {
      return false;
    }
    let r = true;
    for (const k in v1) {
      r = objectEquals(v1[k], v2[k]);
      if (!r) {
        return false;
      }
    }
    return true;
  } else {
    return v1 === v2;
  }
}

export const styl = (style: Style) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const prevStyle = useRef<Style | undefined>();
  if (!prevStyle.current || !objectEquals(prevStyle.current, style)) {
    prevStyle.current = style;
  }
  return prevStyle.current;
};
