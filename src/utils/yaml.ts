import yaml from 'js-yaml'
import { Actions } from '../constants/actions'

export const deyamlinate = (someYaml: string) => {
  try {
    return yaml.load(someYaml)
  } catch (e) {
    console.error(e)
    return null
  }
}

export const validateYamlSteps = (steps: any) => {
  if (!steps) {
    console.warn('not valid: steps null')
    return false
  }
  if (!Array.isArray(steps) ) {
    console.warn('not valid: steps not array')
    return false
  }
  if (steps.find(step => !Object.keys(Actions).includes(step.call))) {
    console.warn('not valid: steps not all have `call`')
    return false
  }
  console.warn('PASS')
  return true
}

export const ensteppen = (yamlSteps: any) => {
  const actions = deyamlinate(yamlSteps)
  if (!validateYamlSteps(actions)) return []
  let acktions = (actions as unknown as any[])
  let namespace: { [key: string]: any } = {}

  const replaceValues = (obj: any, namespace: { [key: string]: any }) => {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        replaceValues(obj[key], namespace);
      } else if (typeof obj[key] === "string") {
        obj[key] = (obj[key] as string).replace(/{{(.*?)}}/g, (match, capture) => {
          let val = Object.keys(namespace).includes(capture) ? namespace[capture] : match;
          if (!val) debugger
          return val
        });
      }
    }
  };
  

  return acktions.map((action: any) => {
    let actionType = action.call
    if (!(actionType in Actions)) {
      return { 'unknown-action': actionType }
    }

    // Replace any "{{somevalue}}" with the actual value from the namespace.
    replaceValues(action, namespace)

    // If there's an output, add it to the namespace.
    if (action.output) {
      namespace[action.output] = action[actionType]
    }

    return action
  })
}
// Test data
const testData = `- 
  call: create-table
  tokenized:
    metadata: ''
    symbol: ZIG
    amount: 1000
    bond-id: 0
  min-players: 2
  max-players: 6
  game-type:
    cash:
      min-buy: 1
      max-buy: 2
      chips-per-token: 10
      small-blind: 10
      big-blind: 20
      tokens-in-bond: 100
  output: table-id
- 
  call: send-message
  username: "{{table-id}}"
  message-kind: text
  content: "Hey ~dev, join my Pokur game at {{table-id}}!"`

// Test function
export function testEnsteppen() {
  const result = ensteppen(testData);
  
  // Check if the result is an array
  if (!Array.isArray(result)) {
    console.log('FAIL: ensteppen did not return an array');
    return;
  }
  
  // Check if the result has the same length as the input
  if (result.length !== 2) {
    console.log('FAIL: ensteppen did not return the correct number of steps');
    return;
  }
  
  // Check if the output value was correctly inserted into the second action
  if (result[1]['project-name'] !== 'Project 1') {
    console.log('FAIL: ensteppen did not correctly replace the output value in the second action');
    console.log(result);
    return;
  }

  console.log('SUCCESS: ensteppen passed all tests');
}