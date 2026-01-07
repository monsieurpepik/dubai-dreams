import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MortgageInput {
  propertyPrice: number;
  downPaymentPercent: number;
  interestRate: number;
  termYears: number;
  isResident: boolean;
}

interface MonthlyBreakdown {
  month: number;
  principal: number;
  interest: number;
  balance: number;
}

interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  loanAmount: number;
  maxLTV: number;
  amortizationSchedule: MonthlyBreakdown[];
  eligibleBanks: Array<{
    name: string;
    rate: number;
    monthlyPayment: number;
  }>;
}

// UAE Bank rates (2025)
const UAE_BANKS = [
  { name: 'Emirates NBD', rate: 4.49 },
  { name: 'Mashreq Bank', rate: 4.74 },
  { name: 'ADCB', rate: 4.99 },
  { name: 'FAB', rate: 4.69 },
  { name: 'RAK Bank', rate: 5.25 },
];

function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                  (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return Math.round(payment * 100) / 100;
}

function generateAmortizationSchedule(
  principal: number, 
  annualRate: number, 
  termYears: number,
  monthlyPayment: number
): MonthlyBreakdown[] {
  const monthlyRate = annualRate / 100 / 12;
  const schedule: MonthlyBreakdown[] = [];
  let balance = principal;
  
  // Only return yearly snapshots to keep response size manageable
  for (let month = 1; month <= termYears * 12; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);
    
    // Only include yearly data points
    if (month % 12 === 0) {
      schedule.push({
        month,
        principal: Math.round(principalPayment * 100) / 100,
        interest: Math.round(interestPayment * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      });
    }
  }
  
  return schedule;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: MortgageInput = await req.json();
    
    console.log('Mortgage calculation request:', input);
    
    const { propertyPrice, downPaymentPercent, interestRate, termYears, isResident } = input;
    
    // UAE LTV rules
    const maxLTV = isResident ? 80 : 75;
    const actualLTV = 100 - downPaymentPercent;
    
    if (actualLTV > maxLTV) {
      return new Response(
        JSON.stringify({ 
          error: `Maximum LTV for ${isResident ? 'residents' : 'non-residents'} is ${maxLTV}%` 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    
    const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, termYears);
    const totalPayment = monthlyPayment * termYears * 12;
    const totalInterest = totalPayment - loanAmount;
    
    const amortizationSchedule = generateAmortizationSchedule(
      loanAmount, 
      interestRate, 
      termYears, 
      monthlyPayment
    );
    
    // Calculate payments for each bank
    const eligibleBanks = UAE_BANKS.map(bank => ({
      name: bank.name,
      rate: bank.rate,
      monthlyPayment: calculateMonthlyPayment(loanAmount, bank.rate, termYears),
    })).sort((a, b) => a.monthlyPayment - b.monthlyPayment);
    
    const result: MortgageResult = {
      monthlyPayment,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      loanAmount,
      maxLTV,
      amortizationSchedule,
      eligibleBanks,
    };
    
    console.log('Mortgage calculation result:', { 
      monthlyPayment: result.monthlyPayment,
      loanAmount: result.loanAmount,
      totalInterest: result.totalInterest 
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in calculate-mortgage function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
