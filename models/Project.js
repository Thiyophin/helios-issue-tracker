import mongoose from 'mongoose';

const projectCodeRegex = /^[a-zA-Z][a-zA-Z0-9]*$/;

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    code: {
      type: String,
      required: true,
      trim: true,
      match: [
        projectCodeRegex,
        'Project code must start with a letter and contain only letters and numbers',
      ],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
