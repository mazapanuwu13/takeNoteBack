import {createPool} from 'mysql2/promise'

export const pool = createPool({
    host:'localhost',
    user: 'root',
    password: '11223344',
    port:3307,
    database: 'notesdb'
})