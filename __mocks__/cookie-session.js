let tempSession,
    session = {};

module.exports = () => (req, res, next) => {
    req.session = tempSession || session;
    tempSession = null;
    next();
};

module.exports.mockSession = sess => (session = sess); //4 tests using same cookie

module.exports.mockSessionOnce = sess => (tempSession = sess); //specific to one test
