import { connection } from "mongoose";

declare global {
    var mongoose: {
        conn: connection | null;
        promise: Promise<typeof connection> | null;    
    }
}

export {};
