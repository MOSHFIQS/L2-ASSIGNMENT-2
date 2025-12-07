import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
     const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload
     const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status])
     return result
}
const getAllVehicle = async () => {
     const result = await pool.query(`SELECT * FROM vehicles`)
     return result
}
const getVehicleById = async (vehicleId: string) => {
     const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId])
     return result
}
const updateVehicleById = async (payload: Record<string, unknown>, vehicleId: string) => {
     const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId])
     const currentVehicle = vehicle.rows[0]

     const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload
     const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3,daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name || currentVehicle.vehicle_name, type || currentVehicle.type, registration_number || currentVehicle.registration_number, daily_rent_price || currentVehicle.daily_rent_price, availability_status || currentVehicle.availability_status, vehicleId])


     return result
}

const deleteVehicleById = async (vehicleId: string) => {
     const getVehicleById = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId])
     const currentVehicle = getVehicleById.rows[0]
     if (currentVehicle.availability_status !== "available") {
          throw new Error("Vehicle cannot be deleted while booked");
     }
     const result = await pool.query(`DELETE  FROM vehicles WHERE id = $1`, [vehicleId])
     return result
}


export const vehicleServices = {
     createVehicle,
     getAllVehicle,
     getVehicleById,
     updateVehicleById,
     deleteVehicleById
}