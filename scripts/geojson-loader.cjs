module.exports = function geojsonLoader(source) {
  const data = JSON.parse(source.toString())

  return `export default ${JSON.stringify(data)}`
}
