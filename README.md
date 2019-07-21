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

## WikiWord Syntax

This package has a looser definition of WikiWords.

In addition to `FooBar` and `FooBarBaz`, it supports `FooBBar` and
`FooB`.

This follow the [exact definition of WikiCase on C2
Wiki](http://wiki.c2.com/?WikiCase), which does not allow these. If
strict compliance is useful, please file a bug.

To avoid forming wikiwords, [C2 suggests embedding an empty
string](http://wiki.c2.com/?SixSingleQuotes). You can do something
similar in commonmark: `Foo<!-- -->Bar`.
