import { Request, Response } from "express"
import { bookingServices } from "./booking.service"


const getAllBookings = async (req: Request, res: Response) => {
     try {
          const result = await bookingServices.getAllBookings()
          res.status(200).json({
               success: true,
               message: "Users retrieved successfully",
               data: result
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}


const createBooking = async (req: Request, res: Response) => {
     try {
          const result = await bookingServices.createBooking(req.body, req.params.bookingId!)
          res.status(200).json({
               success: true,
               message: "Booking created successfully",
               data: result
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}
const updateBooking = async (req: Request, res: Response) => {
     try {
          await bookingServices.updateBooking(req.body)
          res.status(200).json({
               success: true,
               message: "User deleted successfully"
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}



export const bookingController = {
     getAllBookings,
     createBooking,
     updateBooking
}