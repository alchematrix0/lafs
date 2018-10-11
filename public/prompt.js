window.deferredPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('before install prompt called. stash event')
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault()
  // Stash the event so it can be triggered later.
  window.deferredPrompt = e
})
