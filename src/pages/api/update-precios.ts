import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

export const prerender = true

export const POST: APIRoute = async ({ request }) => {
  const serviceKey = import.meta.env.SUPABASE_SERVICE_KEY

  if (!serviceKey) {
    return new Response(JSON.stringify({ error: 'Missing service key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const db = createClient(
    'https://gbklqpbcllhdixiuxwzt.supabase.co',
    serviceKey
  )

  const { precios, upgrades, sucursalId } = await request.json()

  const errors = []

  for (const [productoId, fields] of Object.entries(precios || {})) {
    const { error } = await db
      .from('precios')
      .update({ ...(fields as object), updated_at: new Date().toISOString() })
      .eq('producto_id', productoId)
      .eq('sucursal_id', sucursalId)

    if (error) errors.push(error.message)
  }

  for (const [upgradeId, precio] of Object.entries(upgrades || {})) {
    const { error } = await db
      .from('upgrades')
      .update({ precio, updated_at: new Date().toISOString() })
      .eq('id', upgradeId)

    if (error) errors.push(error.message)
  }

  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: errors.join(', ') }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}