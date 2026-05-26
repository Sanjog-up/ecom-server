import { TPayload } from "../../utils/jwt.utilis";

declare global {
    namespace Express {
        interface Request{
            user?: TPayload;
            file?: Express.Multer.File;
            files?: Express.Multer.File[];
        }
    }
}

export {};