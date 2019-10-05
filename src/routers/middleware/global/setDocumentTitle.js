export default function setDocumentTitle ({ next, to }) {
  // console.log({ next, to })

  if (to.meta.title) {
    document.title = 'VänligaVanor - ' + to.meta.title
  } else {
    document.title = 'VänligaVanor'
  }
}
