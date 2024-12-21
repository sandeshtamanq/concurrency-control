import * as bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/data-source'
import { User } from '../entities/user'
import { ApiResponse } from '../utils/ApiResponse'
import { asyncHandler } from '../utils/asyncHandler'

const userRepository = AppDataSource.getRepository(User)
export const registerHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body

      const hashedPassword = await hashPassword(password)

      const existingUser = await userRepository.findOneBy({ email: email })

      if (existingUser) {
        res.status(403).json(new ApiResponse(400, 'User already exists'))
        return
      }

      const newUser = await userRepository.save(
        userRepository.create({
          email: email,
          password: hashedPassword,
        }),
      )

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: hash, ...user } = newUser

      res
        .status(201)
        .json(new ApiResponse(201, 'User created successfully', user))
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message })
      } else {
        res.status(500).json({ err: 'An unknown error occurred' })
      }
    }
  },
)

export const loginHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const existingUser = await userRepository.findOneBy({ email: email })

    if (!existingUser) {
      res.status(403).json(new ApiResponse(403, "User doesn't exist"))
      return
    }

    const passValid = await comparePassword(password, existingUser.password)

    if (!passValid) {
      res.status(403).json(new ApiResponse(403, 'Invalid email/password'))
      return
    }

    const token = generateToken(existingUser)

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        sameSite: 'none',
      })
      .send({
        token,
      })
  },
)

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

function generateToken(user: Partial<User>): string {
  delete user.password
  return jwt.sign({ ...user }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: '1h',
  })
}
