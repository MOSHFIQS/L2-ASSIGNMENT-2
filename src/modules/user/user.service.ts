import { pool } from "../../config/db";


const getAllUser = async () => {
     const result = await pool.query(`SELECT id, name, email, phone, role FROM users`)
     return result.rows
}

const updateUserById = async (payload: Record<string, unknown>, userId: string) => {
     const vehicle = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId])
     const currentUser = vehicle.rows[0]

     const { name, email, phone, role } = payload
     const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`, [name || currentUser.name, email || currentUser.email, phone || currentUser.phone, role || currentUser.role, userId])

     const updatedUser = result.rows[0]
     delete updatedUser.password
     
     return updatedUser
}

const deleteUserById = async (userId: string) => {
     const result = await pool.query(`DELETE  FROM users WHERE id = $1`, [userId])
     return result
}


export const userServices = {
     getAllUser,
     updateUserById,
     deleteUserById
}