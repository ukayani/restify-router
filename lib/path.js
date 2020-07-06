'use strict';
const assert = require('assert-plus');

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function toRegex (path) {
    if (typeof path === 'string') {
        return new RegExp(escapeRegExp(path));
    }

    if (path instanceof RegExp) {
        return path;
    }

    throw new TypeError('path must be string or RegExp');
}

function normalize (regexStr) {
    regexStr = regexStr.replace(/^\^/, ''); // ensure we don't remove cases where ^ has a different purpose, ie. [^xxx]
    regexStr = regexStr.replace(/\$$/, '');
    return regexStr;
}

function addHat (shouldAdd) {
    if (shouldAdd) {
        return function (regexStr) {
            return '^' + regexStr;
        };
    } else {
        return function (regexStr) {
            return regexStr;
        };
    }

}

function addDollar (shouldAdd) {
    if (shouldAdd) {
        return function (regexStr) {
            return regexStr + '$';
        };
    } else {
        return function (regexStr) {
            return regexStr;
        };
    }
}

function concat (left, right) {
    if (typeof left === 'string' && typeof right === 'string') {
        return left + right;
    }

    const leftR = toRegex(left);
    const rightR = toRegex(right);
    const leftSource = leftR.source;
    const rightSource = rightR.source;
    const hasHat = leftSource.startsWith('^') || rightSource.startsWith('^');
    const hasDollar = leftSource.endsWith('$') || rightSource.endsWith('$');
    const hasIgnoreCase = leftR.ignoreCase || rightR.ignoreCase;
    const hasGlobal = leftR.global || rightR.global;
    const hat = addHat(hasHat); // may need to add a hat
    const dollar = addDollar(hasDollar); // may need to add dollar sign

    const options = (hasIgnoreCase ? 'i' : '') + (hasGlobal ? 'g' : '');

    return new RegExp(dollar(hat(normalize(leftSource) + normalize(rightSource))), options);
}

module.exports = {
    concat: concat
};
