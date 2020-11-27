/**
 * @fileoverview use t function to translate
 * @author lomeanhou
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/use-t-function");
const RuleTester = require("eslint").RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: "module",
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true,
  },
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run("use-t-function", rule, {
  valid: [
    { code: "fn()" },
    { code: '"This is not a chinese string."' },
    { code: "'This is not a chinese string.'" },
    { code: "const s = str => `string is ${str}`;" },
    { code: "<Col xs={6}>{t('名称：')} {name}</Col>" },
    {
      code: "<Well>{t('提示：腾讯会议会议会议，' + '会议已经开始。')}</Well>",
    },
    { code: "t('一' + '二' + '三')" },
  ],

  invalid: [
    {
      code: "'。'",
      errors: [
        {
          message: "。 contains Chinese, use t function to wrap it.",
          type: "Literal",
        },
      ],
    },
    {
      code: "'一' + '二' + '三'",
      errors: [
        {
          message: "一 contains Chinese, use t function to wrap it.",
          type: "Literal",
        },
        {
          message: "二 contains Chinese, use t function to wrap it.",
          type: "Literal",
        },
        {
          message: "三 contains Chinese, use t function to wrap it.",
          type: "Literal",
        },
      ],
    },
    {
      code: "t(`use back quote`)",
      errors: [
        {
          message: "t use template string, use quote instead.",
          type: "CallExpression",
        },
      ],
    },
  ],
});
