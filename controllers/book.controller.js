import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { book } from "../models/book.models.js";
import { apiresponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken"

const CreateBook=asynchandler(async function(req,res){

    const {bookName, description, noOfPages, authorName, publisherName} = req.body;
    
    console.log(bookName,description,noOfPages,authorName,publisherName)

    if ([bookName, description, noOfPages, authorName, publisherName].some((field)=>field?.trim()==="" )) {
        throw new apierror(400,"All fields are required");
        
    }
    const existedbook=await book.find({bookName});

    const newbook= await book.create({
        bookName,
        description,
        noOfPages,
        authorName,
        publisherName
    })

    const registeredBook=await book.findById(newbook._id);

        console.log(registeredBook)

    if(!registeredBook){
        throw new apierror(500, "something went wrong while registering book");
    }

    return res
    .status(201)
    .json(new apiresponse(200, registeredBook, "book registered succesfully"))

})

const getBook=asynchandler(async function(req,res){
    console.log(req.params.userdata);
    const registeredBook=await book.find({
        $or:[{authorName: req.params.userdata},
        {publisherName:req.params.userdata}]
    }).sort({bookName:1})


    if(!registeredBook){
        res
        .status(404)
        .json(new apiresponse(404, "book not found","Error"))
    }
    console.log(registeredBook);
    return res
    .status(201)
    .json(new apiresponse(200, registeredBook, "got book details succesfully"))



    
})

const deleteBook=asynchandler(async function(req,res){

const registeredBook=await book.findByIdAndDelete(req.params.userId);

    console.log(registeredBook)

    if(!registeredBook){
        res
        .status(404)
        .json(new apiresponse(404, "book not found","Error"))
    }

    return res
    .status(201)
    .json(new apiresponse(200, registeredBook, " book deleted succesfully"))

})

const generateAccessAndRefreshToken= async (req,res)=>{
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
             let data = {
                 time: Date(),
            }
         
            const token = jwt.sign(data, jwtSecretKey, {

                expiresIn: '1h' // expires in 24 hours

                 });
         
            res.send(token);
        
    }
    catch (error){
        throw new apierror(
            500,
            "Something went wrong while generating refresh and access token",
            error
        );

    }
}

 


export {CreateBook,getBook,deleteBook,generateAccessAndRefreshToken};

