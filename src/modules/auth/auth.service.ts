import bcrypt from "bcryptjs"
import { pool } from "../../config/db";
import jwt from "jsonwebtoken"
import config from "../../config";



const signupUser = async (payload: Record<string, unknown>) => {
     const { name, email, password, phone, role } = payload
     if ((password as string).length < 6) {
          throw new Error("password must have at least 6 characters");
     }

     const lowercaseEmail = (email as string).toLowerCase()
     const hashedPass = await bcrypt.hash(password as string, 10)
     const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, lowercaseEmail, hashedPass, phone, role])

     const user = result.rows[0]
     delete user.password
     return user
}



const signinUser = async (payload: Record<string, unknown>) => {
     const { email, password } = payload
     const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
     if (result.rows.length === 0) {
          return null
     }
     const user = result.rows[0]

     const match = await bcrypt.compare(password as string, user.password)

     if (!match) {
          return false
     }
     delete user.password;

     const token = jwt.sign({ name: user.name, email: user.email, role: user.role, id: user.id }, config.jwtSecret as string, { expiresIn: "7d" })

     return { token, user }
}


export const authServices = {
     signupUser,
     signinUser
}