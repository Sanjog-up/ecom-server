import multer from "multer";
import path from "path";
import fs from "fs";



export const multerUploader = () => {
    //! upload folder 
    const uploadFolder = path.join(process.cwd(), "uploadss");
    const fileSize = 10 * 1024 * 1024
    //! create folder if doesnt exists 
    if(!fs.existsSync(uploadFolder)){
        fs.mkdirSync(uploadFolder, {recursive: true });
    }
    //! multer storage 
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadFolder)
      },
      filename: function (req, file, cb) {
        const uniqueName = Date.now()+ "-"+ file.originalname;
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueName)
      }
    })
    
    // file filter

    const upload = multer({ storage: storage,
        limits: {
            fileSize: fileSize,
        }
     });
    return upload;
}