const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
    },
    timestamp: {
      type: Date,
    },
    vanue: {
      type: String,
    },
    accessiblity: {
      type: String,
    },
    category: {
      type: String,
    },
    photographers: [
      {
        isActive: { type: Boolean },
        photographerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Photographer",
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
        _id: false
      },
    ],
    guests: {
      allImagesUrl: {type:String},
      selfieImageUrl: {type:String}
    }
  },
  {
    timestamps: true, // Add timestamps option
  }
);

// Define the plugin function
function autoIncrementPlugin(schema) {
  schema.add({
    id: {
      type: Number,
      unique: true,
    },
  });

  schema.pre("save", async function (next) {
    if (!this.id) {
      try {
        const Model = this.constructor;
        const highestDoc = await Model.findOne({}, {}, { sort: { id: -1 } });
        const nextId = highestDoc ? highestDoc.id + 1 : 1;
        this.id = nextId;
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  });
}

// Apply the plugin to your schema
eventsSchema.plugin(autoIncrementPlugin);
eventsSchema.index({ userId: 1 }); // Index for the userId field

const Event = mongoose.model("Event", eventsSchema);

module.exports = Event;
