import { Request, Response } from "express";
import { authServices } from "./auth.service";


const signupUser = async (req: Request, res: Response) => {
     try {
          const result = await authServices.signupUser(req.body)
          // if (!result) {
          //      res.status(404).json({
          //           success: false,
          //           message: "login unsuccessfull",
          //      })
          // } else {
               res.status(201).json({
                    success: true,
                    message: "User registered successfully",
                    data: result.rows[0]
               })
          // }
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}

const signinUser = async (req: Request, res: Response) => {
     try {
          const result = await authServices.signinUser(req.body)

          if (!result) {
               res.status(404).json({
                    success: false,
                    message: "Login unsuccessfull",
               })
          } else {
               res.status(201).json({
                    success: true,
                    message: "Login successful",
                    data: result
               })
          }
     } catch (err: any) {
          res.status(500).json({
               success: false,
               message: err.message
          })
     }
}



export const authController = {
     signupUser,
     signinUser
}