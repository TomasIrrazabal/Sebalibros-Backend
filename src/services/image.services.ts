import { createImageModel, deleteImageModel, isImageSaved } from "../models/Image.model";
import { splitPublicUrl } from "../utils/utils";


export async function createImageService(file: Express.Multer.File, filePath: string): Promise<string> {
    if (!file) {
        throw new Error('VALIDATION_ERROR')
    }
    try {
        const fileName = file.originalname
        if (!await isImageSaved(fileName)) {
            filePath = await createImageModel(file, filePath)
            filePath = splitPublicUrl(filePath)
        }

    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('IMAGE_SAVE_FAILED')
        }
        throw error
    }
    return filePath
}


export async function deleteImageService(filePath: string) {
    if (!filePath) {
        throw new Error('VALIDATION_ERROR')
    }
    try {
        if (await isImageSaved(filePath)) {
            await deleteImageModel(filePath)
        }

    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('IMAGE_SAVE_FAILED')
        }
        throw error
    }
}