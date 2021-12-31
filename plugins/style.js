function isSupportedStyleAttribute(node) {
  return (
    node.name.name === 'style' &&
    node.value.expression.type !== 'MemberExpression'
  );
}

function shouldAddImport(root) {
  return (
    root.scope.block.body
      .filter((n) => n.type === 'ImportDeclaration')
      .find((n) => n.source.value === 'react-native-styl') === undefined
  );
}

function addImportUseInlineStyl(root, t) {
  if (shouldAddImport(root)) {
    const useInlineStyl = t.ImportDefaultSpecifier(
      t.identifier('cacheInlineStyl')
    );
    const imp = t.importDeclaration(
      [useInlineStyl],
      t.stringLiteral('react-native-styl')
    );
    root.unshiftContainer('body', imp);
  }
}

function addUseInlineStyl(path, root, t, isClassMethod) {
  if (!path.scope.hasBinding('styl')) {
    addImportUseInlineStyl(root, t);
    let ident = t.identifier('cacheInlineStyl.useInlineStyl');
    if (isClassMethod)
      ident = t.identifier('cacheInlineStyl.useClassInlineStyl');
    path.scope.push({
      id: t.identifier('styl'),
      init: t.callExpression(ident, []),
    });
  }
}

function isCallExpression(path) {
  const binding = path.scope.bindings[path.node.name];
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

module.exports = function (babel) {
  const { types: t } = babel;

  let root;
  return {
    visitor: {
      Program(path) {
        root = path;
      },

      JSXAttribute(path) {
        if (!isSupportedStyleAttribute(path.node)) return;
        if (shouldSkip(path)) return;
        let isAddImport = false;
        let isClassMethod = path.scope.block.type === 'ClassMethod';

        path.traverse({
          ArrayExpression(p) {
            if (p.parent.type !== 'JSXExpressionContainer') return;
            const id = path.scope.generateUid();
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
            if (!p.scope.bindings[p.node.name]) return;
            if (!isCallExpression(p)) return;
            const id = p.scope.generateUid();
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
            const id = path.scope.generateUid();
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
