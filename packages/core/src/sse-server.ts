// sse-server.ts
import { Express, Request, Response } from 'express'

export type SseClient = {
  id: string
  res: Response
}

export const createSseServer = (app: Express) => {
  const clients: SseClient[] = []

  app.get('/stream/sse', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*') // ✅ important
    res.flushHeaders()

    const id = Date.now().toString()
    clients.push({ id, res })
    console.log(`[SSE] Connected (${clients.length})`)

    // Send handshake event
    res.write(`event: open\ndata: ${JSON.stringify({ message: 'SSE connected', id })}\n\n`)

    req.on('close', () => {
      const index = clients.findIndex((c) => c.id === id)
      if (index !== -1) clients.splice(index, 1)
      console.log(`[SSE] Disconnected (${clients.length})`)
    })
  })

  const pushSseEvent = (message: any) => {
    const data = `data: ${JSON.stringify(message)}\n\n`
    clients.forEach(({ res }) => res.write(data))
  }

  return { pushSseEvent }
}
