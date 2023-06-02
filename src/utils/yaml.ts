import yaml from 'js-yaml'
import { Actions } from '../constants/actions'

export const deyamlinate = (someYaml: string) => {
  try {
    return yaml.load(someYaml)
  } catch (e) {
    return {error: e}
  }
}

export const validateYamlSteps = (steps: any) => {
  if (!steps) {
    // console.warn('not valid: steps null')
    return false
  }
  if (!Array.isArray(steps) ) {
    // console.warn('not valid: steps not array')
    return false
  }
  if (steps.find(step => !Object.keys(Actions).includes(step.call))) {
    // console.warn('not valid: steps not all in Actions', steps)
    // return false
  }
  return true
}

export const rose = (j: any) => j.split('\n').length + 3

export const ensteppen = (yamlSteps: any) => {
  const actions = deyamlinate(yamlSteps) as any
  if (!validateYamlSteps(actions)) {
    return [['yaml-error', actions]]
  }
  let acktions = (actions as unknown as any[])
  return acktions.map((action: any) => {
    let actionType = action.call as string
    // @ts-ignore
    if (!(actionType in Actions) || !(Actions[actionType])) {
      debugger
      return [actionType, null]
    }
    // @ts-ignore
    const newAction = Actions[actionType]
    Object.entries(action).forEach(([k, v]) => {
      if (newAction[k] !== undefined) newAction[k] = v
    })
    return [actionType, newAction]
  // const namespace: { [key: string]: any } = {}
  // const replaceValues = (obj: any, ns: { [key: string]: any }) => {
  //   for (let key in obj) {
  //     if (typeof obj[key] === "object" && obj[key] !== null) {
  //       replaceValues(obj[key], ns);
  //     } else if (typeof obj[key] === "string") {
  //       obj[key] = (obj[key] as string).replace(/{{(.*?)}}/g, (match, capture) => {
  //         let val = Object.keys(ns).includes(capture) ? ns[capture] : match;
  //         if (!val) debugger
  //         return val
  //       });
  //     }
  //   }
  // };

    // // If there's output, add it to the namespace.
    // if (action.output) {
    //   Object.entries(action.output).forEach(([k, v]) => namespace[k] = v)
    // }
    // // Replace any "{{somevalue}}" with the actual value from the namespace.
    // replaceValues(action, namespace)

  })
}
// Test data
const testData = `- 
  call: new-table
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
  output:
    table-id: 1234
- 
  call: create-link-to-table
  id: "{{table-id}}"
  output:
    table-link: "https://my-ship.urbit.network/apps/pokur/join/1234"
- 
  call: send-message
  username: ~dev
  message-kind: text
  content: "Join me for a game of Pokur at {{table-link}}!"`

// Test function
export function testEnsteppen() {
  const result = ensteppen(testData);
  console.log({result})
  
  // Check if the result is an array
  if (!Array.isArray(result)) {
    console.log('FAIL: ensteppen did not return an array');
    return;
  }
  
  // Check if the result has the same length as the input
  if (result.length !== 3) {
    console.log('FAIL: ensteppen did not return the correct number of steps');
    return;
  }
  
  // Check if the output value was correctly inserted into the second action
  if (result[1][1].id !== '1234') {
    console.log('FAIL: ensteppen did not correctly replace the output value in the second action');
    return;
  }

  // Check if the output value was correctly inserted into the second action
  if (result[2][1].content !== 'Join me for a game of Pokur at https://my-ship.urbit.network/apps/pokur/join/1234!') {
    console.log('FAIL: ensteppen did not correctly replace the output value in the second action');
    return;
  }

  console.log('SUCCESS: ensteppen passed all tests');
}