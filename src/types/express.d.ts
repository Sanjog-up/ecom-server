import { TPayload } from "../utils/jwt.utilis";

declare global {
    namespace Express {
        interface Request{
            user?: TPayload;
            file?: Multer.File;
            files?: Multer.File[];
        }
    }
}

export {};