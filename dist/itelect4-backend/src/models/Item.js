import mongoose, { Schema } from "mongoose";
const itemSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 80,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 300,
    },
    location: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    type: {
        type: String,
        required: true,
        enum: ["lost", "found"],
    },
    isClaimed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
const Item = mongoose.models.Item ?? mongoose.model("Item", itemSchema);
export default Item;
