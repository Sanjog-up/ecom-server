import express from "express"
import{
    getAll,
    getById,
    createBrand,
    updateBrand,
    deleteBrand,
} from "../controllers/brand.controller";
import { multerUploader } from "../middlewares/multer.middleware";

const router = express.Router();

//? get all
router.get("/", getAll);

//? get by id 
router.get("/:id", getById);

//? create brand
const upload = multerUploader();
router.post("/", upload.single("brand_logo"), createBrand);

//? update brand
router.patch("/:id", upload.single("brand_logo"), updateBrand);

//? delete
router.delete("/:id", deleteBrand);

export default router;