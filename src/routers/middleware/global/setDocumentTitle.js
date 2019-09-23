export default function setDocumentTitle ({ next, to }) {
  console.log({ next, to })
  document.title = 'VänligaVanor - ' + to.meta.title
}
