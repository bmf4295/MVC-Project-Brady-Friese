const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PetModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: String,
    min: 0,
    required: true,
  },
  picture: {
    type: String,
    trim: true,
    required: false,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});
PetSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return PetModel.find(search).select('name type breed age picture').lean().exec(callback);
};

PetModel = mongoose.model('Pet', PetSchema);

module.exports.PetModel = PetModel;
module.exports.PetSchema = PetSchema;
