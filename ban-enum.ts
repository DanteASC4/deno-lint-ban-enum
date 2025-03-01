/**
 * Helper function to format the body of an enum delcaration, given as one or multiple lines.
 * @param enumMatch - matched enum body
 * @returns a formatted string suitable for `type Name = ...`
 */
const formatEnumVals = (enumMatch: string) => {
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

  return theTypes;
  // return `type ${name} = ${theTypes};`;
};

/**
 * Takes a raw Typescript enum declaration (multi-line ok) and outputs it as a `type Name = ...` string if possible.
 * @param s - enum string to be replaced
 * @param nodeName - name of enum for newly suggested type
 * @returns a `type nodeName = ...` if a type was derivable from the given string
 */
const transformToType = (s: string, nodeName: string) => {
  const allEnumMatches = s.match(/(?<=enum.+){([\s\S]*?)}/gm);
  if (!allEnumMatches) return null;
  const asA = Array.from(allEnumMatches);
  //* Only work with one enum at a time. (I think that's how it works)
  const fixed = formatEnumVals(asA[0]);
  return `type ${nodeName} = ${fixed};`;
};

/**
 * "ban-enum" lint rule definition
 */
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
