import { supabase } from "../../config/supabase";
import type { Book, BookUpdate, BookWhitoutID } from "./types";

const TABLE = 'books';
const BUCKET = process.env.SUPABASE_BUCKET || 'imagenes-libros'


export async function getAllBooksModel(): Promise<Book[]> {
    const response = await supabase
        .from(TABLE)
        .select('*')
        .order('id', { ascending: true })

    if (response.status !== 200) {
        console.error('[Model Error] getABookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
    return response.data as Book[];
}


export async function getABookModel(id: number): Promise<Book> {
    const response = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single()

    if (response.status !== 200) {
        console.error('[Model Error] getABookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }

    return response.data as Book;
}

export async function createBookModel(book: BookWhitoutID) {
    const response = await supabase
        .from(TABLE)
        .insert(book)

    if (response.status !== 201) {
        console.error('[Model Error] createBookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }

    return true
}

export async function updateBookModel(updateBook: BookUpdate) {
    const response = await supabase
        .from(TABLE)
        .update(updateBook)
        .eq('id', updateBook.id)

    if (response.error) {
        console.error('[Model Error] updateBookModel:', response.error)
        throw new Error('DATABASE_ERROR')
    }
    return true
}


export async function deleteBookModel(id: number) {
    const { data: bookData, error: selectError } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();


    if (!bookData || selectError) {
        console.error('[Model Error] deleteBookModel - select:', selectError);
        throw new Error('BOOK_NOT_FOUND');
    }
    const { error: deleteError, status } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', id)

    if (deleteError || status !== 204) {
        console.error('[Model Error] deleteBookModel:', deleteError)
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
