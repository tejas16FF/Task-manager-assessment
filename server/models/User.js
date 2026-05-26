const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {
  LEGACY_USER_ROLES,
  USER_ROLES,
} = require("../constants");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required() {
      return !this.googleId;
    },
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.EMPLOYEE,
  },

  avatar: {
    type: String,
    default: "",
    trim: true,
  },

  designation: {
    type: String,
    default: "",
    trim: true,
  },

  department: {
    type: String,
    default: "",
    trim: true,
  },

  phone: {
    type: String,
    default: "",
    trim: true,
  },

  googleId: {
    type: String,
    default: "",
    index: true,
    select: false,
  },

  assignedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  }],

  isActive: {
    type: Boolean,
    default: true,
  },

  lastLoginAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

userSchema.pre("validate", function normalizeLegacyRole() {
  if (this.role === LEGACY_USER_ROLES.MEMBER) {
    this.role = USER_ROLES.EMPLOYEE;
  }
});

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model("User", userSchema);
