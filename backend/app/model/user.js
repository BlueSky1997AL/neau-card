'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema(
    {
      accountId: { type: String },
      stuId: { type: String },
      balance: { type: String },
      transBalance: { type: String },
      latestUpdateAt: { type: Date },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  return mongoose.model('User', UserSchema);
};
