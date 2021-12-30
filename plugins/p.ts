import type * as BabelCoreNamespace from '@babel/core';
import type * as BabelTypesNamespace from '@babel/types';
import type { PluginObj } from '@babel/core';
import type { Program } from '@babel/types';
import type { NodePath } from '@babel/traverse';

export type Babel = typeof BabelCoreNamespace;
export type BabelTypes = typeof BabelTypesNamespace;

export default function myPlugin(babel: Babel): PluginObj {
  const { types: t } = babel;
  let root: NodePath<Program>;

  return {
    visitor: {
      Program(path) {
        root = path;
        find((n) => n.source.value === 'react-native-react-styl');
        !root.scope.block.body.find(
          (n) =>
            n.type === 'ImportDeclaration' &&
            n.source.value === 'react-native-react-styl'
        );
      },

      JSXAttribute(path) {
        path.scope.hasBinding();
      },
    },
  };
}
