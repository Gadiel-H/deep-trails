module.exports = function globToRegexp(pattern) {
    return new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
};
