module.exports = function (babel) {
  const { types: t } = babel;

  let root;
  return {
    visitor: {
      Program(path) {
        root = path;
      },

      JSXAttribute(path) {
        if (
          path.node.name.name === 'style' &&
          path.node.value.expression.type !== 'MemberExpression'
        ) {
          if (!path.scope.bindings.styl) {
            console.log('[Style.JSXAttribute]');
            const useInlineStyl = t.importSpecifier(
              t.identifier('useInlineStyl'),
              t.identifier('useInlineStyl')
            );
            const imp = t.importDeclaration(
              [useInlineStyl],
              t.stringLiteral('react-native-react-styl')
            );
            root.unshiftContainer('body', imp);
            path.scope.push({
              id: t.identifier('styl'),
              init: t.callExpression(t.identifier('useInlineStyl'), []),
            });
          }

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
