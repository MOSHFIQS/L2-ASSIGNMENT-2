import { Request, Response } from "express"
import { userServices } from "./user.service"


const getAllUser = async (req: Request, res: Response) => {
     try {
          const result = await userServices.getAllUser()
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

const updateUserById = async (req: Request, res: Response) => {
     try {
          if (!req.user) {
               return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
               })
          }
          if (req.user.id !== Number(req.params.userId) && req.user.role !== "admin") {
               return res.status(403).json({
                    success: false,
                    message: "You can't update others data"
               })
          }
          const result = await userServices.updateUserById(req.body, req.params.userId!)
          res.status(200).json({
               success: true,
               message: "User updated successfully",
               data: result
          })
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}
const deleteUserById = async (req: Request, res: Response) => {
     try {
          await userServices.deleteUserById(req.params.userId!)
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



export const userController = {
     getAllUser,
     updateUserById,
     deleteUserById
}