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
      .find((n) => n.source.value === 'react-native-react-styl') === undefined
  );
}

function addImportUseInlineStyl(root, t) {
  if (shouldAddImport(root)) {
    const useInlineStyl = t.importSpecifier(
      t.identifier('useInlineStyl'),
      t.identifier('useInlineStyl')
    );
    const imp = t.importDeclaration(
      [useInlineStyl],
      t.stringLiteral('react-native-react-styl')
    );
    root.unshiftContainer('body', imp);
  }
}

function addUseInlineStyl(path, root, t) {
  if (!path.scope.hasBinding('styl')) {
    addImportUseInlineStyl(root, t);

    path.scope.push({
      id: t.identifier('styl'),
      init: t.callExpression(t.identifier('useInlineStyl'), []),
    });
  }
}

module.exports = function (babel) {
  const { types: t } = babel;

  let root;
  return {
    visitor: {
      Program(path) {
        console.log('start program', path);
        root = path;
      },

      JSXAttribute(path) {
        if (isSupportedStyleAttribute(path.node)) {
          if (
            path.node.leadingComments &&
            path.node.leadingComments.find((c) =>
              c.value.includes('styl:disable')
            )
          ) {
            return;
          }

          addUseInlineStyl(path, root, t);

          path.traverse({
            ArrayExpression(p) {
              if (p.parent.type === 'JSXExpressionContainer') {
                const id = path.scope.generateUid();
                console.log(path.scope.generateUid());
                p.replaceWith(
                  t.callExpression(t.identifier('styl'), [
                    t.stringLiteral(id),
                    t.arrayExpression(p.node.elements),
                  ])
                );
                path.skip();
              }
            },

            Identifier(p) {
              if (p.parent.type === 'JSXExpressionContainer') {
                if (p.scope.bindings[p.node.name]) {
                  if (
                    p.scope.bindings[p.node.name].path.node.init.type !==
                    'CallExpression'
                  ) {
                    const id = p.scope.generateUid();
                    p.replaceWith(
                      t.callExpression(t.identifier('styl'), [
                        t.stringLiteral(id),
                        p.node,
                      ])
                    );
                  }
                }
              }
            },

            ObjectExpression(p) {
              if (p.parent.type === 'JSXExpressionContainer') {
                const id = path.scope.generateUid();
                p.replaceWith(
                  t.callExpression(t.identifier('styl'), [
                    t.stringLiteral(id),
                    p.node,
                  ])
                );
              }
            },
          });
        }
      },
    },
  };
};
