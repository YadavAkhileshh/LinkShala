// Google Analytics utility functions
export const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// Track page views
export const trackPageView = (url) => {
  gtag('config', 'G-Z3MMHC1WGZ', {
    page_path: url,
  })
}

// Track custom events
export const trackEvent = (action, category, label, value) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Track link clicks
export const trackLinkClick = (linkTitle, linkUrl) => {
  gtag('event', 'click', {
    event_category: 'Link',
    event_label: linkTitle,
    custom_parameter_1: linkUrl,
  })
}

// Track search
export const trackSearch = (searchTerm) => {
  gtag('event', 'search', {
    search_term: searchTerm,
  })
}

// Track category selection
export const trackCategorySelect = (category) => {
  gtag('event', 'select_content', {
    content_type: 'category',
    content_id: category,
  })
}