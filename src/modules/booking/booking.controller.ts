import { Request, Response } from "express"
import { bookingServices } from "./booking.service"


const getAllBookings = async (req: Request, res: Response) => {
     try {
          const result = await bookingServices.getAllBookings(req.user!)
          res.status(200).json(result)
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
          const result =  await bookingServices.updateBooking(req.params.bookingId!, req.body, req.user!)
          res.status(200).json(result)
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