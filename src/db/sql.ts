// Helpers to build parameterized SQL statements from plain objects.
// Identifiers are double-quoted to preserve the camelCase column names
// used in the schema (e.g. "bookBinding", "dateUpload").

type Row = Record<string, any>

export interface SqlStatement {
    text: string
    values: any[]
}

// Builds an INSERT from an object: keys -> columns, values -> $1..$n
export function buildInsert(table: string, data: Row): SqlStatement {
    const keys = Object.keys(data)
    const columns = keys.map((k) => `"${k}"`).join(', ')
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const values = keys.map((k) => data[k])

    return {
        text: `INSERT INTO "${table}" (${columns}) VALUES (${placeholders})`,
        values,
    }
}

// Builds an UPDATE ... SET ... WHERE "<idColumn>" = $n from an object.
// The id column is excluded from the SET clause and used as the filter.
export function buildUpdate(table: string, data: Row, idColumn = 'id'): SqlStatement {
    const { [idColumn]: idValue, ...rest } = data
    const keys = Object.keys(rest)

    if (keys.length === 0) {
        throw new Error('NO_FIELDS_TO_UPDATE')
    }

    const setClause = keys.map((k, i) => `"${k}" = $${i + 1}`).join(', ')
    const values = keys.map((k) => rest[k])

    return {
        text: `UPDATE "${table}" SET ${setClause} WHERE "${idColumn}" = $${keys.length + 1}`,
        values: [...values, idValue],
    }
}
