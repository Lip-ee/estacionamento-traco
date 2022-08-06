import { openDatabase } from "../database.js";

export const listVehicles = async (request, response) => {
    // abre o database
    const db = await openDatabase();

    // comando sqlite
    const vehicles = await db.all(`
        SELECT * FROM vehicles
    `);

    // fecha o database
    db.close();

    // retorna o resultado do select
    response.send(vehicles);
};


export const insertVehicles = async (request, response) => {
    // o body vai ser o request da api
    const { model, label, type, owner, observation } = request.body;

    // abre o database
    const db = await openDatabase();

    // comando sqlite (insert)
    const data = await db.run(`
        INSERT INTO vehicles
        (model, label, type, owner, observation)
        VALUES
        (?, ?, ?, ?, ?)
    `, [model, label, type, owner, observation]);

    // fecha o database
    db.close();

    // retorna o resultado do insert
    response.send({
        id: data.lastID,
        model,
        label,
        type,
        owner,
        observation
    });
};


export const updateVehicles = async (request, response) => {
    // o body vai ser o request da api
    const { model, label, type, owner, observation } = request.body;

    // o id vai ser o params
    const { id } = request.params;

    // abre o database
    const db = await openDatabase();

    /* pegando os dados do banco de dados
    para verificar se o veículo existe */
    const vehicle = await db.get(`
        SELECT * FROM vehicles WHERE id = ?
    `, [id]);

    /* verificando se o veículo
    existe no banco de dados */
    if(vehicle){
        /* comando sql (update) */
        const data = await db.run(`
        UPDATE vehicles
            SET model = ?,
                label = ?,
                type = ?,
                owner = ?,
                observation = ?
        WHERE id = ?
    `, [model, label, type, owner, observation, id]);

        db.close();

        // retorna o resultado do update
        response.send({
            id,
            model,
            label,
            type,
            owner,
            observation
        });
        return;
    }

    // fecha o database
    db.close();

    /* se o veículo não existir,
    retorna um valor vazio */
    response.send(vehicle || {});
};


export const deleteVehicles = async (request, response) => {
    // o id vai ser o params
    const { id } = request.params;

    // abre o database
    const db = await openDatabase();

    // comando sqlite (delete)
    const data = await db.run(`
        DELETE FROM vehicles
        WHERE id = ?
    `, [id]);

    // fecha o database
    db.close();

    // retorna o resultado do delete
    response.send({
        id,
        message: `Veículo [${id}] deletado com sucesso`
    });
};