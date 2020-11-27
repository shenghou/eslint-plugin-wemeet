/**
 * @fileoverview use t function to translate
 * @author lomeanhou
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const SYMBOL_REGEX = /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/;
const WORD_REGEX = /[\u3400-\u9FBF]/;

module.exports = {
  meta: {
    docs: {
      description: "Use t function to translate chinese strings.",
      category: "use-t-function",
      recommended: false,
    },
    fixable: null, // or 'code' or 'whitespace'
    schema: [],
  },

  create: function (context) {
    // variables should be defined here
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function hasChinese(value) {
      return WORD_REGEX.test(value) || SYMBOL_REGEX.test(value);
    }

    function checkCallExpression(node) {
      const { type, callee, arguments: args } = node;
      if (type !== "CallExpression" || !callee || !args) {
        return false;
      }
      return true;
    }

    function checkPlusOperator(node) {
      const { type, operator, parent } = node;
      if (type !== "BinaryExpression" || operator !== "+" || !parent) {
        return false;
      }
      return true;
    }

    function traverseToCall(startNode) {
      let callNode;
      let inValid = false;
      const values = [];

      function walk(node) {
        if (!checkPlusOperator(node)) {
          inValid = true;
          return;
        }
        const { left, right, parent } = node;
        if (left.value) {
          values.push(left.value);
        }
        if (right.value) {
          values.push(right.value);
        }
        if (parent && checkCallExpression(parent)) {
          callNode = parent;
          return;
        }
        walk(parent);
      }

      walk(startNode);
      return {
        callNode,
        inValid,
        values,
      };
    }

    function notWrappedByT(value, parentNode) {
      if (!parentNode) {
        return true;
      }
      const isPlusOperator = checkPlusOperator(parentNode);
      const isCallExpression = checkCallExpression(parentNode);
      if (!isCallExpression && !isPlusOperator) {
        return true;
      }

      let _parentNode = parentNode;
      let _values = [];
      if (isPlusOperator) {
        const { callNode, inValid, values } = traverseToCall(parentNode);
        if (inValid) {
          return true;
        }
        _parentNode = callNode;
        _values = values;
      } else {
        _values = [parentNode.arguments[0].value];
      }

      const { callee } = _parentNode;
      if (callee.name !== "t" || !_values.includes(value)) {
        return true;
      }
      return false;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      Literal: function (node) {
        const { value, parent } = node;
        if (hasChinese(value) && notWrappedByT(value, parent)) {
          return context.report({
            node,
            message: "{{ str }} contains Chinese, use t function to wrap it.",
            data: {
              str: node.value,
            },
          });
        }
      },
      CallExpression(expressionNode) {
        const { name, type } = expressionNode.callee;
        if (type === "Identifier" && name === "t") {
          if (expressionNode.arguments.length) {
            const { type: argementType } = expressionNode.arguments[0];
            if (argementType === "TemplateLiteral") {
              context.report({
                node: expressionNode,
                message: "t use template string, use quote instead.",
              });
            }
          }
        }
      },
    };
  },
};
