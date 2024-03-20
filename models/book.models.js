import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const bookschema= new mongoose.Schema({
    bookName:{
        type: String,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },
    noOfPages:{
        type: Number,
        require: true,
    },
    authorName:{
        type: String,
        require: true,
    },
    publisherName:{
        type: String,
        require: true,
    },
    refreshToken:{
        type: String

    }
    
},{timestamps: true})

bookschema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this.id,
            bookName: this.bookName,
            description: this.description,
            noOfPages: this.noOfPages,
            authorName: this.authorName,
            publisherName: this.publisherName,
            
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
}

bookschema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id: this.id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
}

export const book= mongoose.model("book",bookschema)
    

