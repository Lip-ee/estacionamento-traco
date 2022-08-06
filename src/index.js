// imports dos controllers de activities
import {
        checkinActivities,
        checkoutActivities,
        deleteActivities,
        listActivities
    } from './controllers/activitiesControllers.js';

// imports dos controllers de vehicles
import { 
        deleteVehicles,
        insertVehicles,
        listVehicles,
        updateVehicles
    } from './controllers/vehiclesControllers.js';

import express from 'express';


const app = express();
app.use(express.json());


// verificando se a api está funcionando
app.get('/api/ping', (request, response) => {
    response.send({
        message: 'pong!'
    })
});

// porta onde a api está sendo executada
app.listen(8000, () => {
    console.log("servidor rodando na porta 8000");
});



/*   ENDPOINTS API   */
app.get('/api/vehicles', listVehicles); // GET
app.post('/api/vehicles', insertVehicles); // POST
app.put('/api/vehicles/:id', updateVehicles); // PUT
app.delete('/api/vehicles/:id', deleteVehicles); // DELETE


/*   ENDPOINTS ACTIVITIES   */
app.get('/api/activities', listActivities); // SHOW (GET)
app.post('/api/activities/checkin', checkinActivities); // CHECKIN (POST)
app.put('/api/activities/checkout', checkoutActivities); // CHECKOUT (PUT)
app.delete('/api/activities/:id', deleteActivities); // REMOVE (DELETE)
