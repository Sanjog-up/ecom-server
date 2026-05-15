import { Request, Response } from "express";
import { Category } from "..models/category.model";


//! get all
export const getAllCategories = async (req:Request, res: Response) => {
    try {
        const page = parseInt (req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page -1)* limit;

        const filter: any = {};

        if(req.query.status) filter.status = req.query.status;
        if(req.query.parentId) filter.parentId = req.query.parentId;

        if(req.query)
    } catch (error) {
        
    }
} 
//! get by id

//! create 

//! update

//! delete 