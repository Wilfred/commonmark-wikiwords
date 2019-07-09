const commonmark = require("commonmark");

function textNode(text) {
  var node = new commonmark.Node("text", undefined);
  node.literal = text;
  return node;
}

function linkNode(text, url) {
  var urlNode = new commonmark.Node("link", undefined);
  urlNode.destination = url;
  urlNode.appendChild(textNode(text));

  return urlNode;
}

// Regexp must be sticky.
function splitMatches(text, regexp) {
  var i = 0;
  var result = [];

  var match = regexp.exec(text);
  while (match) {
    if (match.index > i) {
      result.push([text.substring(i, match.index), false]);
    }

    var found = match[0];
    result.push([found, true]);

    var matchStart = match.index;
    i = matchStart + found.length;

    match = regexp.exec(text);
  }

  if (i < text.length) {
    result.push([text.substring(i, text.length), false]);
  }

  return result;
}

// WikiWords must start with a capital, include at least two capitals,
// and must include at least one lower case letter inbetween.
const wikiWordsRegexp = /( |^)[A-Z]\w*[a-z]\w*[A-Z]\w*/gm;

function splitWikiWordLinks(node) {
  var parts = splitMatches(node.literal, wikiWordsRegexp);

  return parts.map(part => {
    if (part[1]) {
      return linkNode(part[0], part[0]);
    } else {
      return textNode(part[0]);
    }
  });
}

function transform(parsed) {
  var walker = parsed.walker();
  var event, node;

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

module.exports = transform;
