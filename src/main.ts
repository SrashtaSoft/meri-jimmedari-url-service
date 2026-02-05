/**
 * Meri Zimmedari URL Shortener - Redirect Frontend
 *
 * This service resolves short URL tokens and redirects to the full platform URLs.
 * URL format: https://mzno.in/abc12345
 *
 * Flow:
 * 1. Extract token from URL path
 * 2. Call backend API to resolve token
 * 3. Redirect to resolved URL or show error
 */

// API base URL from environment or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.meri-jimmedari.srashtasoft.in';

interface ResolveResponse {
  url: string;
  url_type: string;
}

interface ErrorResponse {
  error: string;
  code: string;
}

/**
 * Extract token from URL path
 * Expected path format: /{token}
 */
function extractToken(): string | null {
  const path = window.location.pathname;
  // Remove leading slash and get the token
  const token = path.slice(1).split('/')[0];
  return token && token.length > 0 ? token : null;
}

/**
 * Show error page with appropriate message
 */
function showError(code: string, message: string): void {
  const content = document.getElementById('content');
  if (!content) return;

  let title = 'Something went wrong';
  let description = message;
  let icon = 'error';

  switch (code) {
    case 'EXPIRED':
      title = 'Link Expired';
      description = 'This link has expired and is no longer valid. Please request a new link.';
      icon = 'expired';
      break;
    case 'NOT_FOUND':
      title = 'Invalid Link';
      description = 'This link is invalid or does not exist. Please check the URL and try again.';
      icon = 'not-found';
      break;
    case 'INACTIVE':
      title = 'Link Deactivated';
      description = 'This link has been deactivated. Please contact support for assistance.';
      icon = 'inactive';
      break;
    default:
      title = 'Error';
      description = message || 'An unexpected error occurred. Please try again later.';
  }

  content.innerHTML = `
    <div class="error-page">
      <div class="error-icon ${icon}"></div>
      <h1>${title}</h1>
      <p>${description}</p>
      <a href="https://meri-jimmedari.srashtasoft.in" class="btn">
        Go to Meri Zimmedari
      </a>
    </div>
  `;
}

/**
 * Show loading state
 */
function showLoading(): void {
  const content = document.getElementById('content');
  if (!content) return;

  content.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Redirecting...</p>
    </div>
  `;
}

/**
 * Resolve token and redirect
 */
async function resolveAndRedirect(): Promise<void> {
  const token = extractToken();

  if (!token) {
    // No token, redirect to main site
    window.location.href = 'https://meri-jimmedari.srashtasoft.in';
    return;
  }

  showLoading();

  try {
    const response = await fetch(`${API_BASE_URL}/api/public/r/${token}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data: ResolveResponse = await response.json();
      // Redirect to the resolved URL
      window.location.href = data.url;
      return;
    }

    // Handle error responses
    if (response.status === 410) {
      // Gone - Link expired
      showError('EXPIRED', 'This link has expired.');
      return;
    }

    if (response.status === 404) {
      // Not found
      showError('NOT_FOUND', 'This link does not exist.');
      return;
    }

    // Try to parse error response
    try {
      const errorData: ErrorResponse = await response.json();
      showError(errorData.code || 'ERROR', errorData.error || 'An error occurred.');
    } catch {
      showError('ERROR', 'An unexpected error occurred.');
    }
  } catch (error) {
    console.error('Failed to resolve short URL:', error);
    showError('ERROR', 'Failed to connect to the server. Please try again later.');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', resolveAndRedirect);
