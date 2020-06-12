# 3.1

It's now possible to provide an exclusion list of words that should
not be considered WikiWords.

# 3.0

The transform now inserts zero width spaces in WikiWord links, so long
links break more nicely in browsers.

# 2.4

Tweaked WikiWord logic so a single lowercase letter is not a
WikiWord. This prevents 'CPUs' being linkified.

# 2.3

Added a callback for styling links based on their name. This is useful
for styling links that don't exist yet, a common wiki feature.

# 2.2

Fixed an issue with WikiWords occurring in link names.

# 2.1

Fixed an issue with `isWikiWord` where it returned a different result
when called with the same string repeatedly.

Tweaked regexp so `FBar` is a wiki word.

# 2.0

Added a `isWikiWord` helper function.

# 1.0

Initial release
