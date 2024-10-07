'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Moon, Sun, ArrowRightLeft } from 'lucide-react'
import { useTheme } from 'next-themes'

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'TRY']

export default function ModernCurrencyConverter() {
	const [fromCurrency, setFromCurrency] = useState('USD')
	const [toCurrency, setToCurrency] = useState('EUR')
	const [amount, setAmount] = useState('1')
	const [result, setResult] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const { theme, setTheme } = useTheme()

	const handleConvert = async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`/api/exchange?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			const data = await response.json()
			if (data.error) {
				throw new Error(data.error)
			}
			setResult(data.result)
		} catch (error) {
			console.error('Conversion error:', error)
			setResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary transition-colors duration-500">
			<Card className="max-w-6xl mx-auto shadow-lg">
				<CardHeader className="space-y-1">
					<div className="flex justify-between items-center">
						<CardTitle className="text-2xl font-bold">Currency Converter</CardTitle>
						<div className="flex items-center space-x-2">
							<Sun className="h-4 w-4 text-muted-foreground" />
							<Switch
								checked={theme === 'dark'}
								onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
								aria-label="Toggle dark mode"
							/>
							<Moon className="h-4 w-4 text-muted-foreground" />
						</div>
					</div>
					<CardDescription>Convert between different currencies instantly</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="from-currency">From</Label>
							<Select value={fromCurrency} onValueChange={setFromCurrency}>
								<SelectTrigger id="from-currency" className="bg-background text-foreground">
									<SelectValue placeholder="Select currency" />
								</SelectTrigger>
								<SelectContent>
									{currencies.map((currency) => (
										<SelectItem key={currency} value={currency}>
											{currency}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="to-currency">To</Label>
							<Select value={toCurrency} onValueChange={setToCurrency}>
								<SelectTrigger id="to-currency" className="bg-background text-foreground">
									<SelectValue placeholder="Select currency" />
								</SelectTrigger>
								<SelectContent>
									{currencies.map((currency) => (
										<SelectItem key={currency} value={currency}>
											{currency}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="amount">Amount</Label>
						<Input
							id="amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount"
							className="text-lg bg-background text-foreground"
						/>
					</div>
					<Button
						onClick={handleConvert}
						disabled={isLoading}
						className="w-full text-lg h-12 bg-primary text-primary-foreground hover:bg-primary/90"
					>
						{isLoading ? (
							<div className="flex items-center justify-center">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-foreground"></div>
								<span className="ml-2">Converting...</span>
							</div>
						) : (
							<>
								Convert <ArrowRightLeft className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
					{result && (
						<div className="mt-4 p-4 bg-secondary rounded-lg">
							<p className="text-xl font-semibold text-center text-secondary-foreground">
								{amount} {fromCurrency} = {result} {toCurrency}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
