import { Request, Response } from "express";
import { createImageService, deleteImageService } from "../services/image.services";

export async function createImageController(req: Request, res: Response) {
    try {
        const file = req.file;
        let filePath = ``

        if (!file) {
            return res.status(400).json({ message: 'Bad request.' })
        }
        filePath = file.originalname
        filePath = await createImageService(file, filePath)

        return res.status(201).json({ message: 'Image created successfully', data: filePath })

    } catch (error: any) {
        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid Image data.' });
            case 'IMAGE_SAVE_FAILED':
                return res.status(500).json({ error: 'Failed to save Image.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}


export async function deleteImageController(req: Request, res: Response) {
    try {
        const { filePath } = req.body
        if (!filePath) {
            return res.status(400).json({ message: 'Bad request.' })
        }

        await deleteImageService(filePath)

        return res.status(201).json({ message: 'Image deleted' })

    } catch (error: any) {
        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid Image data.' });
            case 'IMAGE_SAVE_FAILED':
                return res.status(500).json({ error: 'Failed to save Image.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

}