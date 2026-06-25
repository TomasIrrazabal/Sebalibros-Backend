import { pool } from "../../db/pool";
import { buildInsert, buildUpdate } from "../../db/sql";
import { supabase } from "../../db/supabase";
import type { Book, BookUpdate, BookWhitoutID } from "../../utils/book.types";

const TABLE = 'books';
const BUCKET = process.env.SUPABASE_BUCKET || 'imagenes-libros'


export async function getAllBooksModel(): Promise<Book[]> {
    try {
        const { rows } = await pool.query<Book>(
            `SELECT * FROM "${TABLE}" ORDER BY "id" ASC`
        )
        return rows;
    } catch (error) {
        console.error('[Model Error] getAllBooksModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}


export async function getABookModel(id: number): Promise<Book> {
    try {
        const { rows } = await pool.query<Book>(
            `SELECT * FROM "${TABLE}" WHERE "id" = $1`,
            [id]
        )
        return rows[0] as Book;
    } catch (error) {
        console.error('[Model Error] getABookModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function createBookModel(book: BookWhitoutID) {
    try {
        const { text, values } = buildInsert(TABLE, book)
        await pool.query(text, values)
        return true
    } catch (error) {
        console.error('[Model Error] createBookModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}

export async function updateBookModel(updateBook: BookUpdate) {
    try {
        const { text, values } = buildUpdate(TABLE, updateBook)
        await pool.query(text, values)
        return true
    } catch (error) {
        console.error('[Model Error] updateBookModel:', error)
        throw new Error('DATABASE_ERROR')
    }
}


export async function deleteBookModel(id: number) {
    let bookData: Book

    try {
        const { rows } = await pool.query<Book>(
            `SELECT * FROM "${TABLE}" WHERE "id" = $1`,
            [id]
        )
        bookData = rows[0]
    } catch (error) {
        console.error('[Model Error] deleteBookModel - select:', error)
        throw new Error('DATABASE_ERROR')
    }

    if (!bookData) {
        console.error('[Model Error] deleteBookModel - select: book not found')
        throw new Error('BOOK_NOT_FOUND')
    }

    try {
        await pool.query(`DELETE FROM "${TABLE}" WHERE "id" = $1`, [id])
    } catch (error) {
        console.error('[Model Error] deleteBookModel:', error)
        throw new Error('DATABASE_ERROR')
    }

    const { error: storageError } = await supabase
        .storage
        .from(BUCKET)
        .remove([`libros/${bookData.image}`])

    if (storageError) {
        console.error('[Model Error] deleteBookModel - storage:', storageError);
    }
    return true
}



export async function deleteImageModel(originalImage: string) {
    const response = await supabase
        .storage
        .from(BUCKET)
        .remove([`libros/${originalImage}`])

    if (response.error) {
        console.error('[Model Error] deleteImageModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
}
