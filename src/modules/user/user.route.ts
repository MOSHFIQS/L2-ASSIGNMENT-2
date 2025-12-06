import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router()

router.get('/', auth("admin"), userController.getAllUser)
router.put('/:userId', auth("admin", "customer"), userController.updateUserById)
router.delete('/:userId', auth("admin"), userController.deleteUserById)


export const userRoutes = router