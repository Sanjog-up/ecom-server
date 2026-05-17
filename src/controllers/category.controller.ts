import { Request, Response } from "express";
import  Category from "../models/category.model";


//! get all
export const getAllCategories = async (req:Request, res: Response) => {
    try {
        const page = parseInt (req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page -1)* limit;

        const filter: any = {};

        if(req.query.status) filter.status = req.query.status;
        if(req.query.parentId) filter.parentId = req.query.parentId;

        const categories = await Category.find(filter).skip(skip).limit(limit);
        const total  = await Category.countDocuments(filter);

        res.status(200).json({
            message: "categories fetched",
            data: categories,
            total,
            page,
            limit,

        });
    } catch (error) {
        res.status(500).json({message: "server error", error});
    }
} ;


//! get by id
export const getCategoryById = async (req:Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if(!category){
            res.status(404).json({ message: "category not found"});
            return;
        }

        res.status(200).json({
            message: "category fetched",
            data: category,
            
        });
    } catch (error) {
        res.status(500).json({message: "server error", error});
    }
} ;

//! create 
export const createCategory = async (req:Request, res: Response) => {
    try {
        const { name, description } = req.body;
        if(!name){
            res.status(400).json({message: "name is required" });
            return;
        }
        const category= new Category({ name, description });
        await category.save();
        res.status(201).json({
            message: "category created",
            data: category,
    });
    } catch (error) {
        res.status(500).json({message: "server error", error});
    }
} ;


//! update
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if(!name && !description){
            res.status(400).json({ message: "name or descrption is required"});
            return;
        }

        const category = await Category.findByIdAndUpdate(id,
            {name, description },
            {new: true}
        );

        if(!category){
            res.status(404).json({message: "category not found"});
            return;
        }

        res.status(200).json({
            message: "category updated",
            data: category,
        });
    } catch (error) {
        res.status(500).json({message: "server error", error});
    }
}

//! delete 
export const deleteCategory = async(req: Request, res: Response) =>{
    try {
        const { id }= req.params;

        const category = await Category.findByIdAndDelete(id);

        if(!category){
            res.status(404).json({ message: "category not found"});
            return;
        }
        res.status(200).json({
            message: "category deleted",
            data: category,
        })
    } catch (error) {
        res.status(500).json({message: "server error", error});
    }
}