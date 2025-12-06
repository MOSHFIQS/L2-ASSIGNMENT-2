import { pool } from "../../config/db";


const getAllBookings = async () => {
     const result = await pool.query(`SELECT * FROM bookings`)
     // return result.rows
     console.log(result.rows);
}

const createBooking = async (payload: Record<string, unknown>, userId: string) => {
     const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload
     // 1. Get vehicle
     const vehicleRes = await pool.query(
          `SELECT * FROM vehicles WHERE id=$1`,
          [vehicle_id]
     );

     if (vehicleRes.rowCount === 0) {
          throw new Error("Vehicle not found");
     }

     const vehicle = vehicleRes.rows[0];

     if (vehicle.availability_status !== "available") {
         throw new Error("Vehicle is not available");
     }


     // 3. Calculate total days
     const start = new Date(rent_start_date as string);
     const end = new Date(rent_end_date as string);

     const diffMs = end.getTime() - start.getTime();
     const totalDays = diffMs / (1000 * 60 * 60 * 24);

     if (totalDays <= 0) {
          throw new Error("Invalid date range");
     }

     const totalPrice = totalDays * vehicle.daily_rent_price;


        const bookingRes = await pool.query(
        `INSERT INTO bookings
         (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
         VALUES ($1, $2, $3, $4, $5, 'active')
         RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
    );

    const booking = bookingRes.rows[0];
    console.log(booking);

     // 6. Update vehicle status
     await pool.query(
          `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
          [vehicle_id]
     );

     return {
          ...booking,
          vehicle: {
               vehicle_name: vehicle.vehicle_name,
               daily_rent_price: vehicle.daily_rent_price
          }
     }

}

const updateBooking = async (payload: Record<string, unknown>) => {
     const result = await pool.query(`DELETE  FROM users WHERE id = $1`, [payload])
     return result
}


export const bookingServices = {
     getAllBookings,
     createBooking,
     updateBooking
}