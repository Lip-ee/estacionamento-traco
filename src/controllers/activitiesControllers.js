import { openDatabase } from "../database.js";

export const listActivities = async (request, response) => {
    const db = await openDatabase();

    const activities = await db.all(`
        SELECT * FROM activities
    `);

    db.close();

    response.send(activities);
};


export const checkinActivities = async (request, response) => {
    const { label } = request.body;
    const checkinAt = (new Date()).getTime();

    const db = await openDatabase();
    const vehicle = await db.get(`
        SELECT * FROM vehicles WHERE label = ?
    `, [label]);

    if(vehicle){
        const data = await db.run(`
            INSERT INTO activities
            (vehicle_id, checkin_at)
            VALUES
            (?, ?)
        `, [vehicle.id, checkinAt]);

        db.close();

        response.send({
            vehicle_id: vehicle.id,
            checkin_at: checkinAt,
            message: `Veículo com a placa [${label}] entrou no estacionamento`
        });
        return;
    }

    db.close();
    
    response.status(400).send({
        message: `Parece que o veículo com a placa [${label}] ainda não foi cadastrado`
    });
};


export const checkoutActivities = async (request, response) => {
    const { label, price } = request.body;

    const db = await openDatabase();
    const vehicle = await db.get(`
        SELECT * FROM vehicles WHERE label = ?
    `, [label]);

    if(vehicle){
        const activiyOpen = await db.get(`
            SELECT * FROM activities
            WHERE vehicle_id = ?
                AND checkout_at IS NULL
        `, [vehicle.id]);

        if(activiyOpen){
            const checkoutAt = (new Date()).getTime();
            const data = await db.run(`
                UPDATE activities
                    SET checkout_at = ?,
                        price = ?
                WHERE id = ?
            `, [checkoutAt, price, activiyOpen.id]);

            db.close();

            response.send({
                vehicle_id: vehicle.id,
                check_out: checkoutAt,
                price: price,
                message: `Veículo com a placa [${label}] realizou um check-out com sucesso!`
            });
            return;
        }

        db.close();
    
        response.status(400).send({
            message: `Parece que o veículo com a placa [${label}] ainda não realizou um novo check-in`
        });
        return;
    }

    db.close();
    
    response.status(400).send({
        message: `Parece que o veículo com a placa [${label}] ainda não foi cadastrado`
    });
};


export const deleteActivities = async (request, response) => {
    const { id } = request.params;

    const db = await openDatabase();

    const data = await db.run(`
        DELETE FROM activities
        WHERE id = ?
    `, [id]);

    db.close();

    response.send({
        id,
        message: `Atividade (check-in) deletada com sucesso`
    });
};