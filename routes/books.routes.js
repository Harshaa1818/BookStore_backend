import { Router } from "express";
import { CreateBook, getBook,deleteBook ,generateAccessAndRefreshToken} from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {processing} from "../middlewares/processing.middleware.js"
const router= Router();



//router.route("/create").post(verifyJWT,processing,CreateBook);
router.route("/create").post(verifyJWT,CreateBook);

router.route("/:userdata").get(verifyJWT,getBook);

router.route("/:userId").delete(verifyJWT,deleteBook);
router.route("/generate-token").post(generateAccessAndRefreshToken);


export default router