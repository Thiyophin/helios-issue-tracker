import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema(
  {
    sequenceNumber: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Sprint sequence number must be an integer',
      },
      immutable: true,
    },

    createdOn: {
      type: Date,
      required: true,
      default: Date.now,
    },

    completedOn: {
      type: Date,
      default: null,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Sprint numbers must be unique within a project.
sprintSchema.index({ project: 1, sequenceNumber: 1 }, { unique: true });

const Sprint = mongoose.model('Sprint', sprintSchema);

export default Sprint;
