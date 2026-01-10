// Centralized contact configuration
// These values are loaded from environment/secrets for production

export const CONTACT_CONFIG = {
  // WhatsApp Business Number (loaded from secret)
  whatsapp: {
    number: import.meta.env.VITE_WHATSAPP_NUMBER || '971000000000',
    defaultMessage: "Hi, I'm interested in Dubai off-plan properties.",
  },
  
  // Company email
  email: 'hello@owningdubai.com',
  
  // Office location
  location: {
    area: 'Dubai Marina',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  
  // Working hours
  hours: {
    weekdays: 'Sunday – Thursday: 9am – 6pm',
    weekends: 'Friday – Saturday: By appointment',
  },
} as const;

// Helper to generate WhatsApp URL
export const getWhatsAppUrl = (message?: string): string => {
  const msg = message || CONTACT_CONFIG.whatsapp.defaultMessage;
  return `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${encodeURIComponent(msg)}`;
};

// Helper to generate WhatsApp URL for a specific property
export const getPropertyWhatsAppUrl = (propertyName: string): string => {
  const message = `Hi, I'm interested in ${propertyName}. Can you provide more details?`;
  return getWhatsAppUrl(message);
};
