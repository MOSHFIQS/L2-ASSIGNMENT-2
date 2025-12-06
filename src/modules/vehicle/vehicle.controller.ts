import { Request, Response } from "express"
import { vehicleServices } from "./vehicle.service"

const createVehicle = async (req: Request, res: Response) => {
     try {
          const result = await vehicleServices.createVehicle(req.body)
          res.status(201).json({
               success: true,
               message: "Vehicle created successfully",
               data: result.rows[0]
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}
const getAllVehicle = async (req: Request, res: Response) => {
     try {
          const result = await vehicleServices.getAllVehicle()
          res.status(201).json({
               success: true,
               message: "Vehicles retrieved successfully",
               data: result.rows
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}
const getVehicleById = async (req: Request, res: Response) => {
     try {
          const result = await vehicleServices.getVehicleById(req.params.vehicleId!)
          res.status(201).json({
               success: true,
               message: "Vehicles retrieved successfully",
               data: result.rows[0]
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}
const updateVehicleById = async (req: Request, res: Response) => {
     try {
          const result = await vehicleServices.updateVehicleById(req.body, req.params.vehicleId!)
          res.status(201).json({
               success: true,
               message: "Vehicles updated successfully",
               data: result.rows[0]
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}
const deleteVehicleById = async (req: Request, res: Response) => {
     try {
          await vehicleServices.deleteVehicleById(req.params.vehicleId!)
          res.status(200).json({
               success: true,
               message: "Vehicle deleted successfully"
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}





export const vehicleController = {
     createVehicle,
     getAllVehicle,
     getVehicleById,
     updateVehicleById,
     deleteVehicleById
}