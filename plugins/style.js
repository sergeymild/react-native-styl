function isStyleImport(isClassMethod) {
  return function (n) {
    const { source } = n;
    const { specifiers } = source;
    const sName =
      specifiers && specifiers.length > 0 && specifiers[0].local.name;
    const localName = isClassMethod ? 'useClassInlineStyl' : 'cacheInlineStyl';
    return source.value === 'react-native-react-styl' && sName === localName;
  };
}

function isSupportedStyleAttribute(node) {
  return (
    node.name.name === 'style' &&
    node.value.expression.type !== 'MemberExpression'
  );
}

function shouldAddImport(root, isClassMethod) {
  return (
    root.scope.block.body
      .filter((n) => n.type === 'ImportDeclaration')
      .find(isStyleImport(isClassMethod)) === undefined
  );
}

function addImportUseInlineStyl(root, t, isClassMethod) {
  if (!shouldAddImport(root, isClassMethod)) return;
  const useInlineStyl = t.importSpecifier(
    t.identifier(isClassMethod ? 'useClassInlineStyl' : 'useInlineStyl'),
    t.identifier(isClassMethod ? 'useClassInlineStyl' : 'useInlineStyl')
  );
  const imp = t.importDeclaration(
    [useInlineStyl],
    t.stringLiteral('react-native-react-styl')
  );
  root.unshiftContainer('body', imp);
}

function rootScope(path) {
  let scope = path.scope;
  if (!scope) return path;
  while (scope.parent && scope.parent.block.type !== 'Program') {
    scope = scope.parent;
  }
  return scope;
}

function addUseInlineStyl(path, root, t, isClassMethod) {
  let scope = path.scope;
  if (!isClassMethod) {
    scope = rootScope(path);
  }

  if (!scope.hasBinding('styl')) {
    addImportUseInlineStyl(root, t, isClassMethod);
    let ident = t.identifier('useInlineStyl');
    if (isClassMethod) ident = t.identifier('useClassInlineStyl');
    scope.push({
      id: t.identifier('styl'),
      init: t.callExpression(ident, []),
    });
  }
}

function isCallExpression(path) {
  const binding = rootScope(path).bindings[path.node.name];
  if (!binding) return false;
  if (!binding.path) return false;
  if (!binding.path.node) return false;
  if (!binding.path.node.init) return false;
  if (!binding.path.node.init.type) return false;
  return binding.path.node.init.type === 'CallExpression';
}

function shouldSkip(path) {
  const comments = path.node.leadingComments;
  return comments && comments.find((c) => c.value.includes('styl:disable'));
}

function randomId(path) {
  return rootScope(path).generateUid();
}

function isNodeModules(state) {
  if (!state.file.opts.filename) return false;
  return state.file.opts.filename.includes('node_modules');
}

function isReactClass(path) {
  const scope = rootScope(path);
  let isClassMethod = scope.block.type === 'ClassDeclaration';
  if (
    scope.block.type === 'FunctionExpression' &&
    scope.block.params.find(
      (p) => p.type === 'Identifier' && p.name === '_PureComponent'
    )
  ) {
    return true;
  }
  return isClassMethod;
}

module.exports = function (babel) {
  const { types: t } = babel;

  let root;
  return {
    visitor: {
      Program(path) {
        root = path;
      },

      JSXAttribute(path, state) {
        if (isNodeModules(state)) return;
        if (!isSupportedStyleAttribute(path.node)) return;
        if (shouldSkip(path)) return;
        let isAddImport = false;
        const isClassMethod = isReactClass(path);

        path.traverse({
          ArrayExpression(p) {
            if (p.parent.type !== 'JSXExpressionContainer') return;
            const id = randomId(path);
            isAddImport = true;
            p.replaceWith(
              t.callExpression(t.identifier('styl'), [
                t.stringLiteral(id),
                t.arrayExpression(p.node.elements),
              ])
            );
          },

          Identifier(p) {
            if (p.parent.type !== 'JSXExpressionContainer') return;
            if (!rootScope(p.scope).hasBinding(p.node.name)) return;
            if (isCallExpression(p)) return;
            const id = randomId(p);
            isAddImport = true;
            p.replaceWith(
              t.callExpression(t.identifier('styl'), [
                t.stringLiteral(id),
                p.node,
              ])
            );
          },

          ObjectExpression(p) {
            if (p.parent.type !== 'JSXExpressionContainer') return;
            const id = randomId(p);
            isAddImport = true;
            p.replaceWith(
              t.callExpression(t.identifier('styl'), [
                t.stringLiteral(id),
                p.node,
              ])
            );
          },
        });
        addUseInlineStyl(path, root, t, isClassMethod);
      },
    },
  };
};
