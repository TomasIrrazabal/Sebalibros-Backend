
export type Book = {
    id: number
    title: string,
    description: string,
    price: number,
    author: string,
    image?: string,
    dateUpload: Date,
    format?: string,
    bookBinding?: string,
    isbn: string,
    resume?: string,
    pages?: number,
    especiality?: string,
    state: Status
}


export enum Status {
    active = "activo",
    inactive = "inactivo"
}

export type BookUpdate = {
    id: number
    title?: string,
    description?: string,
    price?: number,
    author?: string,
    image?: string,
    dateUpload?: Date,
    format?: string,
    bookBinding?: string,
    isbn?: string,
    resume?: string,
    pages?: number,
    especiality?: string,
    state?: Status
}

export type Catalog = { libros: Book[] }
export type BookWhitoutID = Omit<Book, 'id'>