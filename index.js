const commonmark = require("commonmark");

function textNode(text) {
  const node = new commonmark.Node("text", undefined);
  node.literal = text;
  return node;
}

function linkNode(text, url) {
  const urlNode = new commonmark.Node("link", undefined);
  urlNode.destination = url;
  urlNode.appendChild(textNode(text));

  return urlNode;
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

// WikiWords must start with a capital, include at least two capitals,
// and must include at least one lower case letter inbetween.
const wikiWordsRegexp = /( |^)([A-Z][A-Za-z]*[a-z][A-Za-z]*[A-Z][A-Za-z]*)\b/;

function isWikiWord(s) {
  const match = wikiWordsRegexp.exec(s);
  if (match === null) {
    return false;
  }

  const prefix = match[1];
  const matchTextStart = match.index + prefix.length;
  return matchTextStart === 0;
}

function splitWikiWordLinks(node) {
  const parts = splitMatches(node.literal, wikiWordsRegexp);

  return parts.map(part => {
    if (part[1]) {
      return linkNode(part[0], part[0]);
    } else {
      return textNode(part[0]);
    }
  });
}

function transform(parsed) {
  const walker = parsed.walker();
  let event, node;

  while ((event = walker.next())) {
    node = event.node;
    if (event.entering && node.type === "text") {
      splitWikiWordLinks(node).forEach(newNode => {
        node.insertBefore(newNode);
      });
      node.unlink();
    }
  }

  return parsed;
}

module.exports = {
  isWikiWord,
  transform
};
