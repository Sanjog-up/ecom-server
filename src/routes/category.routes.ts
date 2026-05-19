import express from "express";
import {
    getAll,
    getById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller";

const router = express.Router();

//? get all 
router.get("/", getAll);

//? get by id  
router.get("/:id", getById);
//? create category 
router.post("/", createCategory);
//? update category 
router.put("/:id", updateCategory);
//? delete  
router.delete("/:id", deleteCategory);

export default router;