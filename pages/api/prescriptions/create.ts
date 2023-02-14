import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import * as crypto from 'crypto'
import { Status, LockerBoxState, Role } from '../../../types/types'
import { Pharmacist, Staff } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (typeof req.body === 'string') {
        req.body = JSON.parse(req.body)
      }
      const {
        name: N,
        status: S,
        patientId: P,
        balance: B,
        locationId: L,
        lockerBoxId: LB,
        staffId: SI,
        pharmacistId: PI,
        role: R
      } = req.body.data

      const name: string = N
      const status: Status.AwaitingPickup = S
      const patientId: number = parseInt(P)
      const balance: number = parseFloat(B)
      const locationId: number = parseInt(L)
      const lockerBoxId: number = parseInt(LB)
      const pharmacistId = parseInt(PI)
      const staffId = parseInt(SI)
      const role: Role = R
      const random_key = crypto.randomBytes(20).toString('hex')

      const pharmacist = await prisma.pharmacist.findFirstOrThrow({
        where: {
          id: pharmacistId
        }
      })

      const prescription = await prisma.prescription.create({
        data: {
          name: name,
          status: status,
          balance: balance,
          pickupCode: random_key,
          patientId: patientId,
          lockerBoxId: lockerBoxId,
          locationId: locationId,
          pharmacistId,
          staffId
        }
      })

      const lockerBox = await prisma.lockerBox.update({
        where: { id: lockerBoxId },
        data: {
          status: LockerBoxState.full
        }
      })

      res.status(200).json({ message: 'Success', prescription, lockerBox })
    } catch (e) {
      res.status(400).json({ message: 'Bad Request', error: e })
    }
  } else {
    res.status(405).json({ message: `Method: ${req.method} Not Allowed` })
  }
}
