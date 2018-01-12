'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Poll = new Schema({
  user_id: String,
  name: String,
  options: [{
    name: String,
    votes: Number
  }],
  voters: [{
    id: String
  }],
  adders: [{
    id: String
  }]
});

module.exports = mongoose.model("Poll", Poll);