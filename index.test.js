const fc = require("fast-check");
const commonmark = require("commonmark");
const isWikiWord = require("./index").isWikiWord;
const transform = require("./index").transform;

function transformAndRender(src, classCallback) {
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const parsed = reader.parse(src);

  return writer.render(transform(parsed, classCallback)).trim();
}

describe("transform", () => {
  test("Text without WikiWords", () => {
    expect(transformAndRender("foo")).toBe("<p>foo</p>");
  });

  test("Basic WikiWord", () => {
    expect(transformAndRender("WikiWord")).toBe(
      '<p><a href="WikiWord">WikiWord</a></p>'
    );
  });

  test("WikiWord in prose", () => {
    expect(transformAndRender("Hello WikiWord")).toBe(
      '<p>Hello <a href="WikiWord">WikiWord</a></p>'
    );
  });

  test("WikiWord in bold", () => {
    expect(transformAndRender("**WikiWord**")).toBe(
      '<p><strong><a href="WikiWord">WikiWord</a></strong></p>'
    );
  });

  test("WikiWord arbitrary trailing text", () => {
    fc.assert(
      fc.property(fc.string(), s => {
        const rendered = transformAndRender("WikiWord " + s);
        return rendered.includes('<a href="WikiWord">WikiWord</a>');
      })
    );

    expect(transformAndRender("WikiWord")).toBe(
      '<p><a href="WikiWord">WikiWord</a></p>'
    );
  });

  test("No WikiWord in code block", () => {
    expect(transformAndRender("```\nWikiWord\n```")).toBe(
      "<pre><code>WikiWord\n</code></pre>"
    );
  });

  test("No WikiWord in links", () => {
    expect(transformAndRender("[WikiWord](http://foo.com)")).toBe(
      '<p><a href="http://foo.com">WikiWord</a></p>'
    );
  });

  test("No WikiWord in inline code", () => {
    expect(transformAndRender("`WikiWord`")).toBe(
      "<p><code>WikiWord</code></p>"
    );
  });

  test("Acronyms aren't wikiwords", () => {
    expect(transformAndRender("ABC")).toBe("<p>ABC</p>");
  });

  test("Trailing numbers aren't wikiwords", () => {
    expect(transformAndRender("FooBar1")).toBe("<p>FooBar1</p>");
  });
});

describe("isWikiWord", () => {
  test("Yes: FooBar", () => {
    expect(isWikiWord("FooBar")).toBeTruthy();
  });

  test("Yes: FooBBar", () => {
    expect(isWikiWord("FooBBar")).toBeTruthy();
  });

  test("Yes: FBar", () => {
    expect(isWikiWord("FBar")).toBeTruthy();
  });

  test("No: abc", () => {
    expect(isWikiWord("abc")).toBeFalsy();
  });

  test("No: ABC", () => {
    expect(isWikiWord("abc")).toBeFalsy();
  });

  test("No: leading whitespace", () => {
    expect(isWikiWord(" FooBar")).toBeFalsy();
  });

  test("should be a pure function", () => {
    expect(isWikiWord("FooBar")).toBeTruthy();
    expect(isWikiWord("FooBar")).toBeTruthy();
  });
});

describe("Adding classes", () => {
  test("Callback specifies class", () => {
    expect(transformAndRender("WikiWord", () => "myclass")).toBe(
      '<p><a class="myclass" href="WikiWord">WikiWord</a></p>'
    );
  });

  test("No class if callback returns null", () => {
    expect(transformAndRender("WikiWord", () => null)).toBe(
      '<p><a href="WikiWord">WikiWord</a></p>'
    );
  });
});
