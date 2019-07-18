# WikiWords for commonmark.js [![CircleCI](https://circleci.com/gh/Wilfred/commonmark-wikiwords.svg?style=svg)](https://circleci.com/gh/Wilfred/commonmark-wikiwords)[![codecov](https://codecov.io/gh/Wilfred/commonmark-wikiwords/branch/master/graph/badge.svg)](https://codecov.io/gh/Wilfred/commonmark-wikiwords)

This package offers an AST transformer for adding WikiWords syntax to
CommonMark.

## Usage

```javascript
var commonmark = require("commonmark");
var wikiWordsTransform = require("commonmark-wikiwords");

var reader = new commonmark.Parser();
var writer = new commonmark.HtmlRenderer();

var parsed = reader.parse(src);
var transformed = wikiWordsTransform(parsed);

var htmlSrc = writer.render(transformed);
```
