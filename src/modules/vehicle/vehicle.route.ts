import { Router } from "express";
import { vehicleController } from "./vehicle.controller";

const router = Router()

router.post('/', vehicleController.createVehicle)
router.get('/', vehicleController.getAllVehicle)
router.get('/:vehicleId', vehicleController.getVehicleById)
router.put('/:vehicleId', vehicleController.updateVehicleById)
router.delete('/:vehicleId', vehicleController.deleteVehicleById)


export const vehicleRoutes = router