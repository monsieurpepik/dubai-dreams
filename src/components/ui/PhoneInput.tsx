import { Input } from '@/components/ui/input';

const COUNTRY_CODES = [
  { code: '+971', label: '🇦🇪 +971', country: 'UAE' },
  { code: '+44', label: '🇬🇧 +44', country: 'UK' },
  { code: '+1', label: '🇺🇸 +1', country: 'US' },
  { code: '+91', label: '🇮🇳 +91', country: 'India' },
  { code: '+92', label: '🇵🇰 +92', country: 'Pakistan' },
  { code: '+966', label: '🇸🇦 +966', country: 'Saudi' },
  { code: '+49', label: '🇩🇪 +49', country: 'Germany' },
  { code: '+33', label: '🇫🇷 +33', country: 'France' },
  { code: '+86', label: '🇨🇳 +86', country: 'China' },
  { code: '+7', label: '🇷🇺 +7', country: 'Russia' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  placeholder?: string;
}

export const PhoneInput = ({
  value,
  onChange,
  className = '',
  disabled = false,
  error = false,
  id,
  placeholder = '50 123 4567',
}: PhoneInputProps) => {
  // Extract country code and number from value
  const matchedCode = COUNTRY_CODES.find(c => value.startsWith(c.code));
  const countryCode = matchedCode?.code || '+971';
  const phoneNumber = matchedCode ? value.slice(matchedCode.code.length).trim() : value.replace(/^\+\d+\s*/, '');

  const handleCodeChange = (newCode: string) => {
    onChange(`${newCode} ${phoneNumber}`);
  };

  const handleNumberChange = (newNumber: string) => {
    onChange(`${countryCode} ${newNumber}`);
  };

  return (
    <div className={`flex gap-1.5 ${className}`}>
      <select
        value={countryCode}
        onChange={(e) => handleCodeChange(e.target.value)}
        disabled={disabled}
        className={`h-10 px-2 text-sm bg-background border rounded-md shrink-0 w-[90px] focus:outline-none focus:ring-2 focus:ring-ring ${
          error ? 'border-red-500' : 'border-input'
        }`}
        aria-label="Country code"
      >
        {COUNTRY_CODES.map(c => (
          <option key={c.code} value={c.code}>{c.label}</option>
        ))}
      </select>
      <Input
        id={id}
        type="tel"
        value={phoneNumber}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`flex-1 ${error ? 'border-red-500' : ''}`}
      />
    </div>
  );
};
