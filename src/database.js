// configurações do banco de dados
import sqlite3 from "sqlite3";
import { open } from "sqlite";

/* função pra buscar o arquivo do banco
de dados e abrí-lo */
export const openDatabase = async () => {
    return await open({
        filename: 'src/database.db',
        driver: sqlite3.Database
    });
}