const ONE_MONTH_IN_MS = 2629800000;

const cookieOpts = {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    path: '/',
    maxAge: ONE_MONTH_IN_MS
};

const authCookieName = 'token';

module.exports = { cookieOpts, authCookieName };
