// checks if the model is correct

const dgnSchema = require('./dgnSchema.js')
const bubbleTxt = require('../helpers/bubbleTxt.js')

module.exports = function moduleValidation (cy) {
  let validationResult = ''
  let arrWrong = [] // stores wrong connection of nodes

  function componentValidation (cy, component, componentArray) {
    cy.nodes().map(node => {
      // checks if node is the desired component
      if (node.data().asto.concept === component) {
        // stores the neighboring nodes of the component
        const neighborNodes = node.neighborhood().add(node)
        const neighborObject = neighborNodes.data().asto.concept

        Object.keys(neighborObject).map(() => {
          // every neighbor node is added to the array arrWrong
          arrWrong.push(neighborObject)
          // if the neighbor is a valid connection it is removed from the array
          if (componentArray.includes(neighborObject) === true) {
            arrWrong.pop(neighborObject)
          }
        })
      }
    })

    validationResult = `${arrWrong}`

    // if string not empty, show concepts with wrong connections
    if (validationResult !== '') {
      validationResult = `• ${component} has wrong connections`
      bubbleTxt(validationResult)
    }
  }

  // checks the validity of the model using the rules of the schema
  Object.keys(dgnSchema.pairs).map(concept => {
    componentValidation(cy, concept, dgnSchema.pairs[concept])
  })

  // if string is empty, the model is correct
  if (validationResult === '') {
    bubbleTxt('model instance is valid\n👍')
  }
}
