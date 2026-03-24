const TOKEN_KEY = 'ongi_access_token'
const SUBSCRIBER_ID_KEY = 'ongi_subscriber_id'
const EMAIL_KEY = 'ongi_email'
const RETURN_TO_KEY = 'ongi_return_to'

export const authStorage = {
  save(accessToken: string, subscriberId: number, email: string) {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(SUBSCRIBER_ID_KEY, String(subscriberId))
    localStorage.setItem(EMAIL_KEY, email)
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  getSubscriberId(): number | null {
    const id = localStorage.getItem(SUBSCRIBER_ID_KEY)
    return id ? Number(id) : null
  },

  getEmail(): string | null {
    return localStorage.getItem(EMAIL_KEY)
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(SUBSCRIBER_ID_KEY)
    localStorage.removeItem(EMAIL_KEY)
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  saveReturnTo(path: string) {
    localStorage.setItem(RETURN_TO_KEY, path)
  },

  getReturnTo(): string | null {
    return localStorage.getItem(RETURN_TO_KEY)
  },

  clearReturnTo() {
    localStorage.removeItem(RETURN_TO_KEY)
  },
}
