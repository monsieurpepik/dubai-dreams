// Google Analytics 4 utility functions

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

let gaInitialized = false;

/**
 * Initialize GA4 dynamically with a measurement ID.
 * Call once when the tenant config loads.
 */
export const initGA = (measurementId: string) => {
  if (gaInitialized || !measurementId || measurementId === 'G-PLACEHOLDER') return;

  // Load the gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.gtag('config', measurementId);
  gaInitialized = true;
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (typeof window.gtag === 'function' && gaInitialized) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, parameters);
  }
};

// Predefined events for the real estate platform
export const analytics = {
  // Property events
  viewProperty: (propertyId: string, propertyName: string, price: number) => {
    trackEvent('view_item', {
      currency: 'AED',
      value: price,
      items: [{ item_id: propertyId, item_name: propertyName }],
    });
  },

  // Lead events
  submitInquiry: (propertyId: string, propertyName: string) => {
    trackEvent('generate_lead', {
      property_id: propertyId,
      property_name: propertyName,
      source: 'inquiry_form',
    });
  },

  submitContactForm: () => {
    trackEvent('generate_lead', {
      source: 'contact_page',
    });
  },

  // Engagement events
  clickWhatsApp: (propertyName?: string) => {
    trackEvent('click_whatsapp', {
      property_name: propertyName || 'general',
    });
  },

  clickPhoneCall: (propertyName?: string) => {
    trackEvent('click_phone', {
      property_name: propertyName || 'general',
    });
  },

  downloadBrochure: (propertyId: string, propertyName: string) => {
    trackEvent('download_brochure', {
      property_id: propertyId,
      property_name: propertyName,
    });
  },

  // Calculator events
  useCalculator: (propertyPrice: number, downPayment: number) => {
    trackEvent('use_calculator', {
      property_price: propertyPrice,
      down_payment_percent: downPayment,
    });
  },

  // Golden Visa interest
  expressGoldenVisaInterest: (propertyId?: string) => {
    trackEvent('golden_visa_interest', {
      property_id: propertyId,
    });
  },

  // Newsletter
  newsletterSignup: (interests: string[]) => {
    trackEvent('newsletter_signup', {
      interests,
      source: 'website',
    });
  },

  // Investment Quiz
  startQuiz: () => {
    trackEvent('start_quiz', {
      source: 'investment_quiz',
    });
  },

  completeQuiz: (budget: number, priority: string) => {
    trackEvent('complete_quiz', {
      investment_budget: budget,
      investment_priority: priority,
    });
  },
};
