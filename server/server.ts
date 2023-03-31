import express from 'express'
const app = express()
import { config } from 'dotenv'
config()
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { generate } from 'shortid'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'

const limiter = rateLimit({
  windowMs: process.env.RATELIMIT_WINDOW ? Number(process.env.RATELIMIT_WINDOW) : undefined,
  max: process.env.RATELIMIT_MAX ? Number(process.env.RATELIMIT_MAX) : undefined,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(express.json())
app.use(helmet())
app.use(limiter)
app.use(cors())

app.post('/v1/new', async (req, res) => {
  const url: string = req.body.url
  const link = await prisma.link.findFirst({
    where: {
      long: url,
    },
  })

  if (!link) {
    let short = generate()

    while (await prisma.link.findFirst({ where: { short: short } })) {
      short = generate()
    }

    await prisma.link.create({
      data: {
        long: url,
        short,
        createdAt: new Date().toUTCString(),
      },
    })
    res.send({ short: short })
  } else {
    res.send({ short: link.short })
  }
})

app.get("/v1/short-links", async (_, res) => {
  const links = await prisma.link.findMany({
    select: { short: true, long: true, clicks: true },
    orderBy: { clicks: "desc" }
  })

  res.json(links)
})

app.get('/v1/:short', async (req, res) => {
  const short = req.params.short.replace('+', '')
  if (/^[A-Za-z0-9_-]+$/.test(short)) {
    const link = await prisma.link.findFirst({
      where: {
        short,
      },
    })

    if (req.originalUrl.endsWith('+')) {
      const link = await prisma.link.findFirst({
        where: {
          short,
        },
      })

      if (link) {
        res.send(link)
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/404`)
      }
    } else if (link) {
      if (link.long.startsWith('https://') || link.long.startsWith('http://')) {
        res.redirect(link.long)
      } else {
        res.redirect(`http://${link.long}`)
      }

      await prisma.link.update({
        where: {
          short,
        },
        data: {
          clicks: {
            increment: 1,
          },
        },
      })
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/404`)
    }
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/404`)
  }
})

app.delete("/v1/:short", async (req, res) => {
  const short = req.params.short

  if (!await prisma.link.findFirst({ where: { short } })) {
    res.redirect(`${process.env.FRONTEND_URL}/404`)
  } else {
    try {
      await prisma.link.delete({ where: { short } })
      res.json({ deleted: true })
    } catch (e) {
      res.json({
        error: {
          message: "Ei onnistunut."
        }
      })
    }
  }
})

app.listen(process.env.PORT)