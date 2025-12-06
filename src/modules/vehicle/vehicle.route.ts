import { Router } from "express";
import { vehicleController } from "./vehicle.controller";

const router = Router()

router.post('/', vehicleController.createVehicle)
router.get('/', vehicleController.getAllVehicle)
router.get('/:vehicleId', vehicleController.getVehicleById)
router.put('/:vehicleId', vehicleController.updateVehicleById)


export const vehicleRoutes = router