const HttpError = require('../models/http-error');
const User = require('../models/user');


const isAdmin = async (email) => {
  let user;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    return { status: false, error: new HttpError(`Internal Server Error: ${err.message}`, 500)};
  }
  if (!user) {
    return {status: false, error: new HttpError('No user found', 404)};
  }
  if (user.role !== 'admin') {
    return {status: false, error: new HttpError('Forbidden: You do not have permission!', 403)};}
  return {status: true, user};
};

module.exports = isAdmin;
