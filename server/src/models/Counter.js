const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 1000
  }
});

const Counter = mongoose.model('Counter', counterSchema);

/**
 * Atomically retrieves the next sequence number for a given counter key.
 * Collision-safe across multiple concurrent requests.
 *
 * @param {string} counterName - Unique key for the counter (e.g. 'complaintId')
 * @param {number} defaultStart - Default starting number if counter does not exist yet (default: 1000)
 * @returns {Promise<number>} Next sequence number
 */
async function getNextSequence(counterName, defaultStart = 1000) {
  // If counter doesn't exist, we ensure it is initialized with defaultStart
  const counter = await Counter.findOneAndUpdate(
    { _id: counterName },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return counter.seq;
}

/**
 * Synchronize the counter sequence to be at least minVal.
 * Useful after seeding or manual data insertion to guarantee subsequent IDs never collide.
 *
 * @param {string} counterName
 * @param {number} minVal
 */
async function syncCounterMin(counterName, minVal) {
  const current = await Counter.findById(counterName);
  if (!current || current.seq < minVal) {
    await Counter.findOneAndUpdate(
      { _id: counterName },
      { $set: { seq: minVal } },
      { upsert: true }
    );
  }
}

/**
 * Generates the next human-readable Complaint ID (e.g. CP1001, CP1027).
 *
 * @returns {Promise<string>} e.g. "CP1027"
 */
async function getNextComplaintId() {
  const nextSeq = await getNextSequence('complaintId', 1000);
  return `CP${nextSeq}`;
}

module.exports = {
  Counter,
  getNextSequence,
  syncCounterMin,
  getNextComplaintId
};
