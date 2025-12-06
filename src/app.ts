import express, { Request, Response } from "express"
import initDB from "./config/db"
import { authRoutes } from "./modules/auth/auth.route"
import { vehicleRoutes } from "./modules/vehicle/vehicle.route"


const app = express()
initDB()
app.use(express.json())



app.get('/', (req: Request, res: Response) => {
     res.send('Server is running properly')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/vehicles', vehicleRoutes)
// app.use('/api/v1/users', authRoutes)
// app.use('/api/v1/bookings', authRoutes)

app.use((req:Request, res:Response) => {
     res.status(404).json({
          success: false,
          message: "route not found",
          path: req.path,
     })
})

export default app;