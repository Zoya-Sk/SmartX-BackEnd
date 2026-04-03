const cloudinary = require("../config/cloudinaryConnection");

exports.fileUpload = async(file, folder,height, width)=>{
    try {
        const option = {
            resource_type:"auto",
            folder:folder,

        }

        if(height){
            option.height = height;
        }
        if(width){
            option.width = width;
        }

        return await cloudinary.uploader.upload(file.tempFilePath,option);
    } catch (error) {
        console.log("Couldn't Upload File. Please try again.", error);
        throw error; // ✅ re-throw so the caller knows it failed
    }
}