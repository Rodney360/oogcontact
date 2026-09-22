/**
 * Het WhatsApp-logo als icoon.
 *
 * Stond eerst alleen in SnelleContact. Nu de knop "App ons" ook in de
 * voettekst en op de contactpagina staat, hoort hij op één plek thuis.
 */

export function IcoonWhatsApp({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6 0a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.6-1.2l.1-.4v-.3l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.9 2.9 0 006 9.6a5 5 0 001.1 2.7 11.5 11.5 0 004.4 3.9c1.6.7 2.3.7 3.1.6a2.6 2.6 0 001.7-1.2 2.1 2.1 0 00.2-1.2c-.1-.2-.3-.2-.5-.3z" />
    </svg>
  )
}
