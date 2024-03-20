import { book } from "../models/book.models.js";
import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asynchandler(async(req,res,next)=>{                                        //logic for checking/verifying JWT token)
    try {
        const token = req.header("Authorization")?.replace("Bearer ","")
        if(!token)
        {
            throw new apierror(401,"Unauthorized Request")
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        
        const books = await book.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
        if(!book){
            res.status(401);
            res.send('Invalid token');
        }
        req.book=book;
        next();
    } catch (error) {
        res.status(401);
        res.send('Invalid token');
   
    }
});