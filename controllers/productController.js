// const fileUpload = require("express-fileupload");
const Product = require("../models/product");
const Category = require("../models/category");
const { fileUpload } = require("../utils/cloudUpload");
const User = require("../models/user");
const product = require("../models/product");

// UPLOAD PRODUCT
exports.uploadProduct = async (req, res) => {
  try {
    // fetch data
    const {
      productName,
      description,
      price,
      categoryId,
      condition,
      location,
      sellerId,
      contactNumber,
    } = req.body;

    // fetch all images
    const files = req.files;

    // validation
    if (
      !productName ||
      !description ||
      !price ||
      !categoryId ||
      !condition ||
      !location ||
      !sellerId ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please Fill all the input fields!",
      });
    }
    // check if user is defaulter or not
    const sellerDetails = await User.findOne({_id:sellerId});

    if (sellerDetails.isDefaulter > 10) {
      return res.status(400).json({
        success: false,
        message: "You are blocked to sell products",
      });
    }

    // upload image to cloudinary
    let uploadedImages = [];

    // if only single image is being uploaded
    if (!Array.isArray(files.images)) {
      const result = await fileUpload(files.images, process.env.FOLDER_NAME);
      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
    // if multiple images are being uploaded
    else {
      for (let image of files.images) {
        const result = await fileUpload(image, process.env.FOLDER_NAME);
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // create product
    const newProduct = await Product.create({
        productName:productName,
        description:description,
        price:price,
        category:categoryId,
        condition:condition,
        location:location,
        seller:sellerId,
        contactNumber:contactNumber,
        images:uploadedImages,
    })

    // update category
    const updatedCategory = await Category.findByIdAndUpdate(categoryId,{
        $push:{categoryAllProducts:newProduct._id}
    },{returnDocument: 'after'});

    // return response
    return res.status(200).json({
        success:true,
        message:"Product Uploaded Successfully",
        newProduct:newProduct,
    })
  } catch (error) {
    console.log("ERROR >>>", error.message); 
    return res.status(500).json({
        success: false,
        message: "Internal server error!", 
    })
}
};

// HOME PAGE PRODUCTS FETCH
exports.homePageProducts = async(req,res)=>{
  try {
    const page = Number(req.query.page) || 1;
    const limit = 8;

    const skip = (page - 1) * limit;

    // fetch products 
    const allProducts = await Product.find({}).sort({createdAt:-1}).skip(skip).limit(limit);

    // return response
    return res.status(200).json({
      success:true,
      message:"Successfully fetched all products",
      allProducts:allProducts,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
    })
    
  }
}

// GET PRODUCT DETAILS
exports.getProductDetails = async(req,res)=>{
  try {
    // fetch product id
    const productId = req.params.productId;

    // validation
    if(!productId){
      return res.status(400).json({
        succcess:false,
        message:"Something went wrong while fetching productId!",
      })
    }

    // find product details
    const productDetails = await Product.findById(productId).populate("seller", "-password")
  .populate("category")
  .exec();

    if(!productDetails){
      return res.status(500).json({
        success:false,
        message:"Product Details not Found!"
      })
    }

    // return response
    return res.status(200).json({
      success:true,
      message:"Successfully fetched product details",
      productDetails:productDetails,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
    })
    
  }
}

// SEARCH PRODUCTS
exports.searchProducts = async(req,res)=>{
  try {
    // fetch data
    const textSearch = req.params.textSearch || req.query.textSearch || req.query["text-search"];

    // validation
    if(!textSearch){
      return res.status(400).json({
        success:false,
        message:"Please fill in the Input Field.",
      })
    }

    // search the category
    const categories = await Category.find({
      categoryName:{$regex:textSearch,$options:"i"},
    }).select("_id");

    const allCategories = categories.map((cat)=> cat._id);


    // search the product
    const allProducts = await Product.find({
        $or:[
          {productName:{$regex:textSearch,$options:"i"},},
          {category:{$in:allCategories}},
          {description:{$regex:textSearch,$options:"i"}}
        ]
    })

    // return response
    return res.status(200).json({
      success:true,
      message:"Search Product Happened",
      allProducts:allProducts,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Interrnal Server Error!",
    })
    
  }
}

// fetch user upload all products
exports.userProducts = async(req,res)=>{
  try {
    // fetch user id
    const userId = req.user.userId;

    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Couldn't fetch userId!",
      })
    }

    // fetch all user products
    const allProducts = await Product.find({ seller: userId }).sort({createdAt:-1});

    // return 
    return res.status(200).json({
      success:true,
      message:"Fetched All Products successfully",
      allProducts:allProducts,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
    })
    
  }
}

// delete product
exports.deleteProduct = async(req,res)=>{
  try {

    // fetch product id
    const { productId } = req.params;

    // validation
    if(!productId){
      return res.status(400).json({
        success:false,
        message:"Couldn't fetch product id. Please try again.",
      })
    }

    // check if product exists or not
    const productDetails = await product.findById(productId);

    if(!productDetails){
      return res.status(400).json({
        success:false,
        message:"Product not found!",

      })
    }

    // delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    // return response
    return res.status(200).json({
      success:true,
      message:"Deleted product Successfully!",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
    })
    
  }
}

// edit / update product details
exports.editProduct = async(req,res)=>{
  // fetch data
  const { productId } = req.params;
    const {
      productName,
      description,
      price,
      category,
      condition,
      location,
      sellerId,
      contactNumber,
    } = req.body;

      try {

    // validation
    if (
      !productName ||
      !description ||
      !price ||
      !category ||
      !condition ||
      !location ||
      !sellerId ||
      !contactNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please Fill all the input fields!",
      });
    }

    // check if product exists or not
    const productDetails = await Product.findById(productId);
    if(!productDetails){
      return res.status(404).json({
        success:false,
        message:"Product not found!"
      })
    }


    // update product
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      productName:productName,
        description:description,
        price:price,
        category:category,
        condition:condition,
        location:location,
        seller:sellerId,
        contactNumber:contactNumber,
    },{new:true});

    // return response
    return res.status(200).json({
        success:true,
        message:"Product Updated Successfully",
    })


    
  } catch (error) {
    console.log("ERROR >>>", error.message); 
    return res.status(500).json({
        success: false,
        message: "Internal server error", 
    })
  }
}

// update product with new images
exports.updatedProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const {
            productName,
            description,
            price,
            category,
            condition,
            location,
            contactNumber,
        } = req.body;

        // validation
        if (!productName || !description || !price || !category || !condition || !location || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the input fields!",
            });
        }

        // check if product exists
        const productDetails = await Product.findById(productId);
        if (!productDetails) {
            return res.status(404).json({
                success: false,
                message: "Product not found!",
            });
        }

        // update product
        const updated = await Product.findByIdAndUpdate(productId, {
            productName,
            description,
            price,
            category,
            condition,
            location,
            contactNumber,
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully!",
            updatedProduct: updated,
        });

    } catch (error) {
        console.log("ERROR >>>", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}