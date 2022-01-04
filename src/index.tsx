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

function useInlineStyl<Keys extends string>() {
  const inlineStyles = useRef<Map<Keys, Style>>();
  const stylF = useRef<(key: Keys, style: Style) => Style>();
  if (!inlineStyles.current) {
    inlineStyles.current = new Map<Keys, Style>();
  }

  if (!stylF.current) {
    stylF.current = (key: Keys, style: Style) => {
      if (!inlineStyles.current) return style;
      const prevStyle = inlineStyles.current.get(key);
      if (!prevStyle || !objectEquals(prevStyle, style)) {
        inlineStyles.current.set(key, style);
      }
      return inlineStyles.current.get(key);
    };
  }

  return stylF.current!;
}

function useClassInlineStyl<Keys extends string>() {
  //@ts-ignore
  let inlineStyles = this._inlineStyles;
  //@ts-ignore
  let stylF = this._stylF;
  if (!inlineStyles) {
    inlineStyles = new Map<Keys, Style>();
  }

  if (!stylF) {
    stylF = (key: Keys, style: Style) => {
      if (!inlineStyles) return style;
      const prevStyle = inlineStyles.get(key);
      if (!prevStyle || !objectEquals(prevStyle, style)) {
        inlineStyles.set(key, style);
      }
      return inlineStyles.get(key);
    };
  }
  return stylF;
}

export { useInlineStyl, useClassInlineStyl };
