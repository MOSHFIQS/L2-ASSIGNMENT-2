import bcrypt from "bcryptjs"
import { pool } from "../../config/db";
import jwt from "jsonwebtoken"
import config from "../../config";


const signupUser = async (payload: Record<string, unknown>) => {
     const { name, email, password, phone, role } = payload
     const lowercaseEmail = (email as string).toLowerCase() 
     const hashedPass = await bcrypt.hash(password as string, 10)
     console.log(hashedPass);

     const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, lowercaseEmail, hashedPass, phone, role])

     return result

}

const signinUser = async (payload: Record<string, unknown>) => {
     const { email, password } = payload
     const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
     // console.log("result",result.rows[0]);
     if (result.rows.length === 0) {
          return null
     }
     const user = result.rows[0]

     const match = await bcrypt.compare(password as string, user.password)

     if (!match) {
          return false
     }

     const token = jwt.sign({ name: user.name, email: user.email, role: user.role }, config.jwtSecret as string, { expiresIn: "7d" })

     console.log(user,token);

     return result
}


export const authServices = {
     signupUser,
     signinUser
}