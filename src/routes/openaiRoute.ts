import express from 'express'
import OpenAI from 'openai'
const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

router.post('/', async (req, res) => {
  const prompt = req.body.prompt
  try {
    const response = await openai.images.generate({
      prompt: prompt + 'sneakers shoes',
      n: 1,
      size: '512x512',
    })
    res.send(response.data)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal server error' })
  }
})
export default router
