import mongoose, {model, models, Document} from "mongoose";

export interface IGridAd extends Document {
    title: string;
    description: string;
    thumbnail: string;
}

const GridAdSchema = new mongoose.Schema<IGridAd>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
});
const GridAd = models.GridAd || model<IGridAd>("GridAd", GridAdSchema);

export default GridAd;