const transformBodyToType = (enumMatch: string, name: string) => {
  const lines = enumMatch.split(',');
  const vals: string[] = [];

  for (const line of lines) {
    const parts = line.match(/\w+/gm);
    if (!parts) continue;

    const pA = Array.from(parts);
    if (pA.length === 1) {
      vals.push(pA[0]);
    } else if (pA.length >= 2) {
      vals.push(pA[1]);
    }
  }

  const theTypes = vals.reduce((a, c, i) => {
    const isNum = /^[0-9]*?$/g.test(c);
    if (isNum) {
      a += c; // Don't make numbers a string!
    } else {
      a += '"';
      a += c;
      a += '"';
    }
    if (i !== vals.length - 1) {
      a += ' | ';
    }
    return a;
  }, '');

  return `type ${name} = ${theTypes};`;
};

const transformToType = (s: string, nodeName: string) => {
  const allEnumMatches = s.match(/(?<=enum.+){([\s\S]*?)}/gm);
  if (!allEnumMatches) return null;
  const asA = Array.from(allEnumMatches);
  const fixed = transformBodyToType(asA[0], nodeName);
  return fixed;
};

const banEnum: Deno.lint.Plugin = {
  name: 'ban-enum',
  rules: {
    'ban-enum': {
      create(ctx) {
        console.log(ctx);
        return {
          TSEnumDeclaration(node) {
            ctx.report({
              node,
              message: 'Do not use Enums.',
              fix(fixer) {
                const original = ctx.sourceCode.getText(node);
                const fixed = transformToType(original, node.id.name);
                if (fixed) {
                  return fixer.replaceText(node, fixed);
                } else {
                  return fixer.remove(node);
                }
              },
              hint: 'Perhaps a type union instead?',
            });
          },
        };
      },
    },
  },
};

export default banEnum;
