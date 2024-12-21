import { NextFunction, Request, Response } from 'express'
import jwt, { TokenExpiredError } from 'jsonwebtoken'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.cookie?.split('=')[1]

  if (!token) {
    res.status(401).json({
      message: 'Unauthorized',
    })

    return
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY ?? '')

    req.user = decode as { id: string; email: string }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        message: 'token expired',
      })
      return
    }
    res.status(401).json({
      message: 'Unauthorized',
    })
  }

  next()
}
