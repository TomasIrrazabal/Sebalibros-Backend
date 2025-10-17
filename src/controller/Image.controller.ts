import { Request, Response } from "express";
import { uploadImageToDB } from "../models/Image.model";

export async function uploadImage(req: Request, res: Response) {
    try {
        const file = req.file;
        let filePath = ``

        if (file) {

            filePath = `libros/${file.originalname}`
            filePath = await uploadImageToDB(file, filePath)
        }

        return res.status(201).json({ message: 'Image successfully registered', data: filePath })

    } catch (e: any) {
        return res.status(500).json({ error: e.message ?? 'Error registering the image' });
    }
}
