const ONE_MONTH_IN_MS = 2629800000;

const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV !== 'dev',
    maxAge: ONE_MONTH_IN_MS
};

const authCookieName = 'token';

module.exports = { cookieOpts, authCookieName };
