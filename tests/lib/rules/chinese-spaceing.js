/**
 * @fileoverview use t function to translate
 * @author lomeanhou
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/chinese-spaceing");
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
ruleTester.run("chinese-spaceing", rule, {
  valid: [{ code: "'腾讯 1'" }, { code: "'2 腾讯'" }, { code: "'B 腾讯'" }],

  invalid: [
    {
      code: "'1腾讯'",
      errors: [
        {
          message: "English or Number should have space around.",
          type: "Literal",
        },
      ],
    },
    {
      code: "'B腾讯'",
      errors: [
        {
          message: "English or Number should have space around.",
          type: "Literal",
        },
      ],
    },
  ],
});
