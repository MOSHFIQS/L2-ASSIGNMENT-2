import { pool } from "../../config/db";


const getAllBookings = async (user: Record<string, unknown>) => {
     if (user.role === "admin") {
          const result = await pool.query(
               `
            SELECT 
                b.*,
                u.name AS customer_name,
                u.email AS customer_email,
                v.vehicle_name,
                v.registration_number
            FROM bookings b
            JOIN users u ON u.id = b.customer_id
            JOIN vehicles v ON v.id = b.vehicle_id
            ORDER BY b.id DESC;
            `
          );

          // Format response
          const data = result.rows.map(b => ({
               id: b.id,
               customer_id: b.customer_id,
               vehicle_id: b.vehicle_id,
               rent_start_date: b.rent_start_date,
               rent_end_date: b.rent_end_date,
               total_price: b.total_price,
               status: b.status,
               customer: {
                    name: b.customer_name,
                    email: b.customer_email
               },
               vehicle: {
                    vehicle_name: b.vehicle_name,
                    registration_number: b.registration_number
               }
          }));

          return {
               success: true,
               message: "Bookings retrieved successfully",
               data
          };
     }

     // ========== CUSTOMER VIEW ==========
     const result = await pool.query(
          `
        SELECT 
            b.*,
            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN vehicles v ON v.id = b.vehicle_id
        WHERE b.customer_id = $1
        ORDER BY b.id DESC;
        `,
          [user.id]
     );

     const data = result.rows.map(b => ({
          id: b.id,
          vehicle_id: b.vehicle_id,
          rent_start_date: b.rent_start_date,
          rent_end_date: b.rent_end_date,
          total_price: b.total_price,
          status: b.status,
          vehicle: {
               vehicle_name: b.vehicle_name,
               registration_number: b.registration_number,
               type: b.type
          }
     }));

     return {
          success: true,
          message: "Your bookings retrieved successfully",
          data
     };
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

const updateBooking = async (bookingId: string, payload: Record<string, unknown>, user: Record<string, unknown>) => {
     const { status } = payload;

     // get the booking
     const bookingRes = await pool.query(
          `SELECT * FROM bookings WHERE id = $1`,
          [bookingId]
     );

     if (bookingRes.rowCount === 0) {
          throw new Error("Booking not found");
     }

     const booking = bookingRes.rows[0];
     const now = new Date(); 
     const rentStart = new Date(booking.rent_start_date); 

     
     if (user.role === "customer") {
          if (booking.customer_id !== user.id) {
               throw new Error("You can only cancel your own bookings");
          }

          if (status !== "cancelled") {
               throw new Error("Customers can only cancel bookings");
          }


          if (now > rentStart) {
               throw new Error("Cannot cancel booking after start date");
          }


          const result = await pool.query(
               `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
               [status, bookingId]
          );

          await pool.query(
               `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
               [booking.vehicle_id]
          );

          return {
               success: true,
               message: "Booking cancelled successfully",
               data: result.rows[0]
          };
     }

     if (user.role === "admin") {
          if (status !== "returned") {
               throw new Error("Admin can only mark booking as returned");
          }

          const result = await pool.query(
               `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
               [status, bookingId]
          );

          await pool.query(
               `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
               [booking.vehicle_id]
          );

          return {
               success: true,
               message: "Booking marked as returned. Vehicle is now available",
               data: {
                    ...result.rows[0],
                    vehicle: { availability_status: "available" }
               }
          };
     }

     throw new Error("Unauthorized or invalid action");
}


export const bookingServices = {
     getAllBookings,
     createBooking,
     updateBooking
}