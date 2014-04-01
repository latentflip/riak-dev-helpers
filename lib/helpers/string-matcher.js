function escapeRegExp (string){
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function ExactMatcher (matchString) {
    this.match = function (testString) {
        return matchString === testString;
    };
}

function FuzzyMatcher (matchString) {
    var regex;

    //Escape regex
    matchString = escapeRegExp(matchString);

    //unescape \* -> .*
    matchString = matchString.replace(/\\\*/g, '.*');

    //unescape \^ -> ^
    matchString = matchString.replace(/\\\^/g, '^');

    matchString = '^' + matchString + '$';

    regex = new RegExp(matchString);

    this.match = function (testString) {
        var result = regex.test(testString);
        return result;
    };
}

module.exports = function (matchString) {
    if (matchString.indexOf('*') === -1) {
        return new ExactMatcher(matchString);
    } else {
        return new FuzzyMatcher(matchString);
    }
};

//Test
if (require.main === module) {
    var assert = require('assert');

    var exact = module.exports('.foo$^');
    assert.ok(exact instanceof ExactMatcher);
    assert.ok(exact.match('.foo$^'));
    assert.ok(!exact.match('foo$^'));

    var fuzzyStarEnd = module.exports('foo.bar*');
    assert.ok(fuzzyStarEnd instanceof FuzzyMatcher);


    var result = fuzzyStarEnd.match('foo.bar');
    assert.ok(result);
    assert.ok(!fuzzyStarEnd.match('fooxbar'));
    assert.ok(!fuzzyStarEnd.match('blah-foo.ba'));

    assert.ok(!fuzzyStarEnd.match('foo.ba'));
    assert.ok(fuzzyStarEnd.match('foo.bar.baz'));

    var fuzzyStarStart = module.exports('*foo.bar');
    assert.ok(fuzzyStarStart instanceof FuzzyMatcher);

    assert.ok(fuzzyStarStart.match('foo.bar'));
    assert.ok(!fuzzyStarStart.match('fooxbar'));

    assert.ok(!fuzzyStarStart.match('oo.bar'));
    assert.ok(fuzzyStarStart.match('baz.foo.bar'));

    var fuzzyStarBoth = module.exports('*foo.bar*');
    assert.ok(fuzzyStarBoth instanceof FuzzyMatcher);

    assert.ok(fuzzyStarBoth.match('foo.bar'));
    assert.ok(!fuzzyStarBoth.match('fooxbar'));

    assert.ok(!fuzzyStarBoth.match('oo.ba'));
    assert.ok(fuzzyStarBoth.match('baz.foo.bar'));
    assert.ok(fuzzyStarBoth.match('foo.bar.baz'));

    var testMatcher = module.exports('test*');
    assert.ok(testMatcher.match('test'));
    assert.ok(testMatcher.match('test_foo'));
    assert.ok(testMatcher.match('test::foo'));

    console.log('Tests passed');
}
