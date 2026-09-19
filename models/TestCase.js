import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema(
  {
    feature: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feature',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    steps: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TestCase = mongoose.model('TestCase', testCaseSchema);

export default TestCase;
