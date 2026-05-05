import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Security: Never return the password in standard queries by default
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password if it has been modified
userSchema.pre('save', async function () {
  if (!this.isModified('password_hash')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// Instance method to compare incoming passwords with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

export default mongoose.model('User', userSchema);