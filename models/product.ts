import mongoose, {Schema, Document} from 'mongoose'

export interface IProduct extends Document {
    name : string;
    price : number;
    description : string;
    quantity : number;
    image : string;
}

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
})

const Product = mongoose.model<IProduct>('Product', productSchema)

export default Product