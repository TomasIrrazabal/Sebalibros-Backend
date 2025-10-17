import { createBookModel, deleteBookModel, getABookModel, getAllBooksModel, updateBookModel } from "../models/book.model";
import { Book, BookUpdate, BookWhitoutID } from "../models/types";

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
        if (error.message === 'DATABASE_ERROR') {
            throw new Error('BOOK_DELETION_FAILED')
        }
        throw error
    }

    return { message: 'Success' };

}