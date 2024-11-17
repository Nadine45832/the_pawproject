const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /.+@.+\..+/;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: [MIN_PASSWORD_LENGTH, "Password must be at least 8 characters long"],
    },
    phoneNumber: { type: String, trim: true, default: null },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Please input a valid email address"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      immutable: true,
    },
  },
  { timestamps: true,
  toJSON: {
    //hide sensitive fields like password
    transform: function (doc, ret) {
      delete ret.password;
      return ret;
  },
},
toObject: {
  //Same behavior for objects
  transform: function (doc,ret) {
    delete ret.password;
    return ret;
    },
   },
  }   
);

// Pre-save hook to hash password if modified
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new error ("Error hashing password"));
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

//Index the email field for efficient queries
userSchema.index({ email: 1});

module.exports = mongoose.model("User", userSchema);
