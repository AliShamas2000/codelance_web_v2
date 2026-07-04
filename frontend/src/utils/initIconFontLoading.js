export function initIconFontLoading() {
  const markLoaded = () => {
    document.documentElement.classList.add('icons-loaded')
  }

  if (!('fonts' in document)) {
    markLoaded()
    return
  }

  const fontChecks = [
    document.fonts.load('400 24px "Material Symbols Outlined Variable"'),
    document.fonts.load('1em "Material Symbols Outlined Variable"'),
  ]

  Promise.race([
    Promise.all(fontChecks),
    new Promise((resolve) => setTimeout(resolve, 4000)),
  ])
    .then(markLoaded)
    .catch(markLoaded)

  if (document.fonts.status === 'loaded') {
    markLoaded()
  } else {
    document.fonts.ready.then(markLoaded).catch(markLoaded)
  }
}
