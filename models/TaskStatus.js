import mongoose from 'mongoose';

const statusNameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;

const taskStatusEntrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      match: [
        statusNameRegex,
        'Status name must start with a letter and contain only letters and numbers',
      ],
    },

    permittedPredecessorsStates: {
      type: [
        {
          type: String,
          trim: true,
          match: [statusNameRegex, 'Predecessor status must contain only letters and numbers'],
        },
      ],
      required: true,
      default: [],
    },
  },
  {
    _id: false,
  },
);

const taskStatusSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    statuses: {
      type: [taskStatusEntrySchema],
      required: true,

      validate: [
        {
          validator: (statuses) => statuses.length > 0,
          message: 'At least one task status is required',
        },
        {
          validator: (statuses) => {
            const names = statuses.map((status) => status.name);

            return new Set(names).size === names.length;
          },
          message: 'Task status names must be unique',
        },
        {
          validator: (statuses) => {
            const names = new Set(statuses.map((status) => status.name));

            return statuses.every((status) =>
              status.permittedPredecessorsStates.every((predecessor) => names.has(predecessor)),
            );
          },
          message: 'Every predecessor must reference an existing status',
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

// One status configuration per project.
taskStatusSchema.index({ project: 1 }, { unique: true });

const TaskStatus = mongoose.model('TaskStatus', taskStatusSchema);

export default TaskStatus;
