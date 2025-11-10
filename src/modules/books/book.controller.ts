import { Request, Response, NextFunction } from "express";
import { createBookService, deleteBookService, deleteImageService, getABookService, getAllBooksService, updateBookService } from "./book.services";
import { BookUpdate, BookWhitoutID } from "./types";

export async function getBooksController(_req: Request, res: Response) {
    try {
        const books = await getAllBooksService()
        return res.status(200).json({ books });
    }
    catch (error: any) {
        switch (error.message) {
            case 'RESPONSE_ERROR':
                return res.status(404).json({ error: 'Error: No Books were found.' });
            case 'BOOK_FETCH_FAILED':
                return res.status(500).json({ error: 'Failed to fetch books.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

export async function getABookController(req: Request, res: Response) {
    try {
        const { id } = req.params

        const book = await getABookService(parseInt(id))
        if (!book) return res.status(404).json({ message: 'No books were found.' })

        return res.status(200).json({ book });
    } catch (error: any) {
        switch (error.message) {
            case 'RESPONSE_ERROR':
                return res.status(404).json({ error: 'Error: No Book was found.' });
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid book data.' });
            case 'BOOK_FETCH_FAILED':
                return res.status(500).json({ error: 'Failed to fetch book.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}



export async function createBookController(req: Request, res: Response) {

    try {

        const book: BookWhitoutID = req.body;

        if (!book) return res.status(400).json({ message: 'Bad request.' })
        if (!book.author || !book.price || !book.title || !book.image || !book.isbn) {
            return res.status(400).json({ message: 'Bad request.' })
        }

        await createBookService(book)

        return res.status(201).json({ message: 'Book created successfully' })
    } catch (error: any) {
        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid book data.' });
            case 'BOOK_SAVE_FAILED':
                return res.status(500).json({ error: 'Failed to save book.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}


export async function updateBookController(req: Request, res: Response) {
    try {
        const { originalImage, ...rest } = req.body;
        const updatedBook: BookUpdate = rest;
        const result = await updateBookService(updatedBook);

        return res.status(200).json(result)
    } catch (error: any) {

        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid book data.' });
            case 'BOOK_UPDATE_FAILED':
                return res.status(500).json({ error: 'Failed to update the book.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }


    }
}

export async function deleteBookController(req: Request, res: Response) {
    try {
        const { id } = req.params

        await deleteBookService(parseInt(id))

        return res.status(204).send()
    } catch (error: any) {

        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid book data.' });
            case 'BOOK_DELETION_FAILED':
                return res.status(500).json({ error: 'Failed to delete the book.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }


    }
}


export async function deleteImageController(req: Request, res: Response, next: NextFunction) {
    try {
        const { originalImage, image } = req.body;

        if (!originalImage && !image) {
            return next()
        }

        await deleteImageService(originalImage)

        return next();

    } catch (error: any) {
        switch (error.message) {
            case 'VALIDATION_ERROR':
                return res.status(400).json({ error: 'Invalid Image data.' });
            case 'IMAGE_DELETE_FAILED':
                return res.status(500).json({ error: 'Failed to delete Image.' });
            default:
                console.error('[Controller Error] createBookController:', error)
                return res.status(500).json({ error: 'Internal Server Error' })
        }
    }

}
