"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../models/product"));
const router = express_1.default.Router();
//Setting up multer for file upload
// const storage = multer.diskStorage({
//     destination : (req, file, cb) =>{
//         cb(null, './uploads/') // Set the destination folder for uploaded files
//     },
//     filename: (req, file, cb) =>{
//         cb(null, new Date().toISOString() + file.originalname)
//     }
// })
// const upload = multer({storage})
//New product creation
// router.post("/", upload.single('image'), async(req, res)=>{
//     const {name, price, description, quantity} = req.body
//     const image = req.file?.path
//     try{
//         const product = await Product.create({
//             name, price, description, quantity, image
//         })
//         return res.send({status:1, data: product, message : "Product is created successfully"})
//     }
//     catch(err){
//         return res.send({status:0, data: null, message: `Product creation failed :${err}`})
//     }
// })
//New product creation
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, description, quantity, image } = req.body;
    try {
        const product = yield product_1.default.create({
            name, price, description, quantity, image
        });
        return res.send({ status: 1, data: product, message: "Product is created successfully" });
    }
    catch (err) {
        return res.send({ status: 0, data: null, message: `Product creation failed :${err}` });
    }
}));
//searching, sorting and pagination
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('I am hit');
    try {
        const { search, sort, page, limit } = req.query;
        // Create a sortOptions object with default values
        const query = search ? { name: { $regex: search, $options: 'i' } } : {};
        const sortOptions = getSortOptions(sort);
        const totalProducts = yield product_1.default.countDocuments(query); //count the number of products
        const totalPages = Math.ceil(totalProducts / Number(limit)); // count the total pages basis the number of products and limit per page
        const products = yield product_1.default.find(query)
            .sort(sortOptions)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        res.send({ status: 1, data: { products, totalPages, currentPage: Number(page), totalProducts, }, message: 'Product listing successful.' });
    }
    catch (err) {
        return res.send({ status: 0, data: null, message: 'Error in getting the products' });
    }
}));
// Helper function to get sort options based on the sort string
function getSortOptions(sort) {
    if (!sort) {
        return { name: 1 }; // Default sort by name in ascending order
    }
    const [sortProperty, sortOrder] = sort.split(':'); //extract from the user query that on what basis I have to sort(sortProperty), and in which order I have to sort(sortOrder) 
    if (!sortOrder || !['asc', 'desc'].includes(sortOrder)) { // if user did not tell ascending or descending in query
        return { name: 1 }; // Default sort by name in ascending order
    }
    const sortOptions = {};
    sortOptions[sortProperty] = sortOrder === 'asc' ? 1 : -1;
    return sortOptions;
}
exports.default = router;
