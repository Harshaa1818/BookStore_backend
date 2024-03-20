import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { book } from "../models/book.models.js";
import { apiresponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken"

//logic for registering a book
const CreateBook=asynchandler(async function(req,res){

    const {bookName, description, noOfPages, authorName, publisherName} = req.body;
    
   
    if ([bookName, description, noOfPages, authorName, publisherName].some((field)=>field?.trim()==="" )) {             //validation for:  all fields are mandatory
        return res
        .status(404) 
        .json(new apierror(404, "Error is: ","All fiels are mandatory"));
    }
    const existedbook=await book.find({bookName:req.params.userdata})  
    
    
       
      
    // if(existedbook)  {                                                                       // check if there exist another book with same name or not , if yes then throw error{
    //     return res
    //     .status(401)
    //     .json( new apierror(401, existedbook,"Book name already exist")); 
    // }

    const newbook= await book.create({ 
        bookName,
        description,
        noOfPages,
        authorName,
        publisherName
    })

    const registeredBook=await book.findById(newbook);  // get details of newly registered book

       

    if(!registeredBook){
       return res
       .status(404) 
       .json(new apierror(500, registeredBook,"something went wrong while registering book")); // if details are empty that means some error has occured while storing in DB
    }

    return res
    .status(201)
    .json(new apiresponse(200, registeredBook, "book registered succesfully"))  // return response if book get saved in DB

})

//logic for finding/searching a book
const getBook=asynchandler(async function(req,res){
  
    const registeredBook=await book.find({              // find a book by publisher OR author Name
        $or:[{authorName:   req.params.userdata},
            {publisherName: req.params.userdata}]
    })


    if(!registeredBook)                                 // if book does't exist then throw error
    {
        return res
        .status(404)
        .json(new apiresponse(404, registeredBook, "book not exist with given publisher / author name"))
    }
    
    return res
    .status(201)
    .json(new apiresponse(200, registeredBook, " book details fetched succesfully"))         // if we got the book we are searching for then log book details 

})

//logic for deleting a book from DB
const deleteBook=asynchandler(async function(req,res){

const registeredBook=await book.findByIdAndDelete(req.params.userId);           // find a book id for which we want to delete a book

    

    if(!registeredBook){                                                         // if book doesn't exist with that id then throw error
        res
        .status(404)
        .json(new apiresponse(404, "book not found","Error"))
    }

    return res
    .status(201)
    .json(new apiresponse(200, registeredBook, " book deleted succesfully"))      // if book got deleted from DB then log the message

})


//logic for generating JWT
const generateAccessAndRefreshToken= async (req,res)=>{
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
             let data = 
             {
                 time: Date(),
             }
         
            const token = jwt.sign(data, jwtSecretKey,   // when we create a JWT it get's store in token variable , later we will share it as a response
                {

                expiresIn: '1h' // expires in 1 hour

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

