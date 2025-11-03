
import { isImageSaved } from "./utils/image.utils";
import { createBookModel, deleteBookModel, deleteImageModel, getABookModel, getAllBooksModel, updateBookModel } from "./book.model";
import { Book, BookUpdate, BookWhitoutID } from "./types";

export async function getAllBooksService(): Promise<Book[]> {
    try {

        const books: Book[] = await getAllBooksModel()
        if (books.length === 0) {
            throw new Error('RESPONSE_ERROR')
        }
        return books;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('BOOK_FETCH_FAILED')
        }
        throw error
    }
}


export async function getABookService(id: number): Promise<Book> {
    if (id === 0) {
        throw new Error('VALIDATION_ERROR')
    }
    try {

        const book: Book = await getABookModel(id)
        if (!book) {
            throw new Error('RESPONSE_ERROR')
        }

        return book;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('BOOK_FETCH_FAILED')
        }
        throw error
    }
}

export async function createBookService(book: BookWhitoutID) {
    if (!book) {
        throw new Error('VALIDATION_ERROR')
    }
    try {
        await createBookModel(book)
        return true;
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('BOOK_SAVE_FAILED')
        }
        throw error
    }
}

export async function updateBookService(updateBook: BookUpdate) {
    if (!updateBook) {
        throw new Error('VALIDATION_ERROR')
    }
    try {
        await updateBookModel(updateBook)
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('BOOK_UPDATE_FAILED')
        }
        throw error
    }
    return { message: 'Success' };
}

export async function deleteBookService(id: number) {
    if (id === 0) {
        throw new Error('VALIDATION_ERROR')
    }

    try {
        await deleteBookModel(id)
    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR' || error.mensaje === 'BOOK_NOT_FOUND') {
            throw new Error('BOOK_DELETION_FAILED')
        }
        throw error
    }

    return { message: 'Success' };

}

export async function deleteImageService(originalImage: string) {
    if (!originalImage) {
        throw new Error('VALIDATION_ERROR')
    }
    try {
        if (await isImageSaved(originalImage)) {
            await deleteImageModel(originalImage)
        }

    } catch (error: any) {
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('IMAGE_DELETE_FAILED')
        }
        throw error
    }
}