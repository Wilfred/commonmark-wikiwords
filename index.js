const commonmark = require("commonmark");

function textNode(text) {
  const node = new commonmark.Node("text", undefined);
  node.literal = text;
  return node;
}

function htmlNode(text) {
  const node = new commonmark.Node("html_inline", undefined);
  node.literal = text;
  return node;
}

function linkNodes(opts) {
  let className = null;
  if (opts.callback) {
    className = opts.callback(opts.text);
  }

  let openTagSrc;
  if (className) {
    openTagSrc = `<a class="${className}" href="${opts.url}">`;
  } else {
    openTagSrc = `<a href="${opts.url}">`;
  }

  return [htmlNode(openTagSrc), textNode(opts.text), htmlNode("</a>")];
}

function splitMatches(text, regexp) {
  // Regexp must be sticky.
  regexp = new RegExp(regexp, "gm");

  let i = 0;
  const result = [];

  let match = regexp.exec(text);
  while (match) {
    const prefix = match[1];
    const matchText = match[2];

    const matchTextStart = match.index + prefix.length;
    if (matchTextStart > i) {
      result.push([text.substring(i, matchTextStart), false]);
    }

    result.push([matchText, true]);
    i = matchTextStart + matchText.length;

    match = regexp.exec(text);
  }

  if (i < text.length) {
    result.push([text.substring(i, text.length), false]);
  }

  return result;
}

// WikiWords must start with a capital and must end with a lower case letter.
const wikiWordsRegexp = /( |^)([A-Z][A-Za-z]*[a-z])\b/;

function isWikiWord(s) {
  const match = wikiWordsRegexp.exec(s);
  if (match === null) {
    return false;
  }

  const prefix = match[1];
  const matchTextStart = match.index + prefix.length;
  if (matchTextStart !== 0) {
    return false;
  }

  // WikiWords must contain at least two capitals, so 'Hello' isn't a WikiWord.
  if ((s.match(/[A-Z]/g) || []).length < 2) {
    return false;
  }

  // WikiWords must contain at least two lower case letters, so 'CPUs'
  // isn't a wikiword.
  if ((s.match(/[a-z]/g) || []).length < 2) {
    return false;
  }

  return true;
}

function splitWikiWordLinks(node, classCallback) {
  const parts = splitMatches(node.literal, wikiWordsRegexp);

  let result = [];
  parts.forEach(part => {
    if (part[1] && isWikiWord(part[0])) {
      result = result.concat(
        linkNodes({
          url: part[0],
          text: part[0],
          callback: classCallback
        })
      );
    } else {
      result.push(textNode(part[0]));
    }
  });
  return result;
}

function transform(parsed, classCallback) {
  const walker = parsed.walker();
  let event;

  let inLink = false;

  while ((event = walker.next())) {
    const node = event.node;
    if (event.entering && node.type === "text" && !inLink) {
      splitWikiWordLinks(node, classCallback).forEach(newNode => {
        node.insertBefore(newNode);
      });
      node.unlink();
    }
    if (node.type === "link") {
      inLink = event.entering;
    }
  }

  return parsed;
}

module.exports = {
  isWikiWord,
  transform
};
