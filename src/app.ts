import express, { Request, Response } from "express"
import initDB from "./config/db"
import { authRoutes } from "./modules/auth/auth.route"
import { vehicleRoutes } from "./modules/vehicle/vehicle.route"
import { userRoutes } from "./modules/user/user.route"
import { bookingRoutes } from "./modules/booking/booking.route"

// for autoReturnService
import "./jobs/autoReturnService"; 

const app = express()
initDB()
app.use(express.json())



app.get('/', (req: Request, res: Response) => {
     res.send('Server is running properly')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/vehicles', vehicleRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/bookings', bookingRoutes)

app.use((req:Request, res:Response) => {
     res.status(404).json({
          success: false,
          message: "route not found",
          path: req.path,
     })
})

export default app;