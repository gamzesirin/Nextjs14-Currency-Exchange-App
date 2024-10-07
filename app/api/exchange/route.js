export async function GET(request) {
	const { searchParams } = new URL(request.url)
	const from = searchParams.get('from')
	const to = searchParams.get('to')
	const amount = searchParams.get('amount')

	if (!from || !to || !amount) {
		return new Response(JSON.stringify({ error: 'Missing parameters' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		})
	}

	const apiKey = process.env.EXCHANGE_API_KEY
	if (!apiKey) {
		console.error('API key is not set')
		return new Response(JSON.stringify({ error: 'API configuration error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}

	const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`

	try {
		const res = await fetch(url)
		if (!res.ok) {
			throw new Error(`API responded with status: ${res.status}`)
		}
		const data = await res.json()

		if (data.result !== 'success') {
			throw new Error(`API error: ${data['error-type']}`)
		}

		const rate = data.conversion_rates[to]
		if (!rate) {
			throw new Error(`Exchange rate not found for ${to}`)
		}

		const result = rate * Number(amount)

		return new Response(JSON.stringify({ result: parseFloat(result.toFixed(2)) }), {
			headers: { 'Content-Type': 'application/json' }
		})
	} catch (error) {
		console.error('API error:', error)
		return new Response(JSON.stringify({ error: error.message || 'An error occurred during conversion' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		})
	}
}
