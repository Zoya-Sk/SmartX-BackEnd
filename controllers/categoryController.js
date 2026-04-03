const { fileUpload } = require("../utils/cloudUpload");
const Category = require("../models/category");

// CREATE CATEGORY
exports.createCategory = async(req,res)=>{
    try {
        // fetch data
        const { categoryName } = req.body;
        const categoryImage = req.files.image;

        // validation
        if(!categoryName || !categoryImage){
            return res.status(400).json({
                success:false,
                message:"Please fill all the input fields"
            })
        }
        const isCategoryNameExists = await Category.findOne({categoryName:categoryName});

        if(isCategoryNameExists){
            return res.status(400).json({
                success:false,
                message:"Category Name already Exists.",
            })
        }

        const uploadImage = await fileUpload(categoryImage, "SmartXzoya");

        // create new category
        const newCategory = await Category.create({
            categoryName:categoryName,
            categoryImage:uploadImage.secure_url,
        })

        // return response
        return res.status(200).json({
            success:true,
            message:"Category Created Successfully!",
            newCategory:newCategory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!",
        })
    }
}

// GET ALL CATEGORIES
exports.getAllCategories = async(req,res)=>{
    try {

        // fetch all categories
        const allCategories = await Category.find({});

        // return response
        return res.status(200).json({
            success:true,
            message:"Successfully fetched all Categories",
            allCategories:allCategories,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!",

        })
        
    }
}

// GET CATEGORY DETAILS
exports.categoryDetails = async(req,res)=>{
    try {
        // fetch category id
        const categoryId = req.params.categoryId;

        // validation
        if(!categoryId){
            return res.status(400).json({
                success:false,
                message:"Couldn't Fetch Category Id. Please try again.",
            })
        }

        const categoryPageDetails = await Category.findById(categoryId).populate("categoryAllProducts").exec();

        if(!categoryPageDetails){
            return res.status(404).json({
                success:false,
                message:"Category details not found",
            })
        }

        // return response
        return res.status(200).json({
            success:true,
            message:"Fetched Category Page Details Successfully!",
            categoryPageDetails:categoryPageDetails,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error!",
        })
    }
}