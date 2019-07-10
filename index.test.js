const commonmark = require("commonmark");
const transform = require("./index");

function transformAndRender(src) {
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const parsed = reader.parse(src);

  return writer.render(transform(parsed)).trim();
}

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

test("No WikiWord in code block", () => {
  expect(transformAndRender("```\nWikiWord\n```")).toBe(
    "<pre><code>WikiWord\n</code></pre>"
  );
});

test("No WikiWord in inline code", () => {
  expect(transformAndRender("`WikiWord`")).toBe("<p><code>WikiWord</code></p>");
});

test("Acronyms aren't wikiwords", () => {
  expect(transformAndRender("ABC")).toBe("<p>ABC</p>");
});
