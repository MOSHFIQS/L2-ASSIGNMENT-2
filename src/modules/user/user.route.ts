import { Router } from "express";
import { userController } from "./user.controller";

const router = Router()

router.get('/', userController.getAllUser)
router.put('/:userId', userController.updateUserById)
router.delete('/:userId', userController.deleteUserById)


export const userRoutes = router