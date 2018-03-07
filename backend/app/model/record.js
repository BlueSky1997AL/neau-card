'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RecordSchema = new Schema(
    {
      stuId: { type: String },
      tradeDate: { type: Date },
      firmName: { type: String },
      transactionType: { type: String },
      cost: { type: String },
      balance: { type: String },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    }
  );

  return mongoose.model('Record', RecordSchema);
};
