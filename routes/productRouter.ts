import express from 'express'
import multer from 'multer'
import Product from '../models/product'
import { SortOrder } from 'mongoose'

const router = express.Router()

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
router.post("/",async(req, res)=>{
    const {name, price, description, quantity, image} = req.body
    try{
        const product = await Product.create({
            name, price, description, quantity, image
        })
        return res.send({status:1, data: product, message : "Product is created successfully"})
    }
    catch(err){
        return res.send({status:0, data: null, message: `Product creation failed :${err}`})
    }
})




//searching, sorting and pagination
router.get('/', async(req, res)=>{
  // console.log('I am hit');
  
    try{
        const{search, sort, page, limit} = req.query

       // Create a sortOptions object with default values
       const query = search ? { name: { $regex: search as string, $options: 'i' } } : {};
       const sortOptions = getSortOptions(sort as string);
   
       const totalProducts = await Product.countDocuments(query); //count the number of products
       const totalPages = Math.ceil(totalProducts / Number(limit)); // count the total pages basis the number of products and limit per page
   
       const products = await Product.find(query)
         .sort(sortOptions)
         .skip((Number(page) - 1) * Number(limit))
         .limit(Number(limit));
   
       res.send({status: 1,data: {products,totalPages,currentPage: Number(page),totalProducts,},message: 'Product listing successful.' })
    }
    catch(err){
      return res.send({ status: 0,data:null , message: 'Error in getting the products' });
    }
})


// Helper function to get sort options based on the sort string
function getSortOptions(sort: string | undefined): { [key: string]: SortOrder } {
  if (!sort) {
    return { name: 1 }; // Default sort by name in ascending order
  }

  const [sortProperty, sortOrder] = sort.split(':'); //extract from the user query that on what basis I have to sort(sortProperty), and in which order I have to sort(sortOrder) 

  if (!sortOrder || !['asc', 'desc'].includes(sortOrder)) { // if user did not tell ascending or descending in query
    return { name: 1 }; // Default sort by name in ascending order
  }

  const sortOptions: { [key: string]: SortOrder } = {};
  sortOptions[sortProperty] = sortOrder === 'asc' ? 1 : -1;
  return sortOptions;
}

export default router;