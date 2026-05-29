import express from "express";
import {
    getAll,
    getById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { Only_Admins } from "../types/enum.types";
import { multerUploader } from '../middlewares/multer.middleware';


const router = express.Router();
const upload = multerUploader();

//? get all 
router.get("/", getAll);

//? get by id  
router.get("/:id", getById);
//? create category 
router.post("/", authenticate(Only_Admins), upload.single("image"), createCategory);
//? update category 
router.put("/:id", authenticate(Only_Admins), upload.single("image"), updateCategory);
//? delete  
router.delete("/:id", authenticate(Only_Admins), deleteCategory);

export default router;