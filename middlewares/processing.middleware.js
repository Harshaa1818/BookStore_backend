//import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";


export const processing = asynchandler(async(req,res,next)=>{                                        //logic for checking/verifying JWT token)
    try {
        res.send("processing");
        next();
    } catch (error) {
        res.status(401);
        res.send('Invalid token');
   
    }
});