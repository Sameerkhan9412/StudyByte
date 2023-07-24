const mongoose = require("mongoose");

// Define the Section schema
const sectionSchema = new mongoose.Schema({
	sectionName: {
		type: String,
	},
	SubSection: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "SubSection",
		},
	],
});

// Export the Section model
module.exports = mongoose.model("Section", sectionSchema);