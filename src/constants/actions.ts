//
// This file contains a list of API calls that each represent an Action takeable by Alzabo.
// When a user authorizes an Action, one of the below calls will be populated with data and sent to the running ship.
//
export const Actions = {
  'send-message': {
    username: '',
    'message-kind': '',
    content: '',
    reference: 0,
    mentions: [],
  },
  'send-reaction': {
    'on-message': 0,
    reaction: '',
  },
  'call': {
    username: '',
    'message-kind': 'webrtc-call' ,
    content: 'start' ,
  },
  'make-conversation': {
    name: '',
    'conversation-metadata': {
      managed: {
        members: [],
        leaders: [],
      },
      org: {
        members: '',
        name: '',
        id: '',
      },
      open: '',
      dm: '',
      inbox: '',
    }

  },
  'make-invite': {
    'conversation-id': 0,
    to: '',
  },
  'send-message-to-group': {
    'message-kind': '',
    content: '',
    reference: 0,
    mentions: [],
  },
  'send-reaction-to-group': {
    'on-message': 0,
    reaction: '',
  },
  'call-group': {
    content: 'request: wss://websocket-endpoint.com'
  },
  'create-project': {
    'project-name': '',
    'desk-name': '',
    'fetch-desk-from-remote-ship': '',
    'special-configuration-args': '',
  },
  'delete-project': {
    'project-name': '',
  },
  'add-desk-to-project': {
    'project-name': '',
    'desk-name': '',
    index: 0,
    'fetch-desk-from-remote-ship': '',
  },
  'remove-desk-from-project': {
    'project-name': '',
    'desk-name': '',
  },
  'publish-contract': {
    'project-name': '',
    'desk-name': '',
    'town-id': 0,
    'contract-jam-path': '',
    who: '',
  },
  'publish-gall-app': {
    'project-name': '',
    'desk-name': '',
    title: '',
    info: '',
    color: '',
    image: '',
    version: [0, 0, 0],
    website: '',
    license: '',
  },
  'create-file': {
    'project-name': '',
    'desk-name': '',
    file: '',
    text: '',  
  },
  'create-file-from-template': {  
    'project-name': '',
    'desk-name': '',
    file: '',
    text: '',
  },
  'edit-file': {
    'project-name': '',
    'desk-name': '',
    file: '',
    text: '',  
  },
  'delete-file': {
    'project-name': '',
    'desk-name': '',
    file: '',  
  },
  'new-table': {  
    host: '',
    tokenized: {
      metadata: '',
      symbol: '',
      amount: 0,
      'bond-id': 0,
    },
    'min-players': 0,
    'max-players': 0,
    'game-type': {
      cash: {
        'min-buy': 0,
        'max-buy': 0,
        'buy-ins': { '~ship': 0 },
        'small-blind': 0,
        'big-blind': 0,
        'chips-per-token': 0,
        'tokens-in-bond': 0,
      },
      sng: {
        'starting-stack': 0,
        'round-duration': 0,
        'blinds-schedule': [],
        'current-round': 0,
        'round-is-over': false,
        payouts: 0,
      }
    },
    public: false,
    'spectators-allowed': false,
    'turn-time-limit': 0,
  },
  'start-game': {
    id: 0
  },
  'create-link-to-table': {
    id: 0
  },
}

export const AppsByAction = {
  'send-message': 'pongo',
  'send-reaction': 'pongo',
  'call': 'pongo',
  'make-conversation': 'pongo',
  'make-invite': 'pongo',
  'send-message-to-group': 'pongo',
  'send-reaction-to-group': 'pongo',
  'call-group': 'pongo',
  'create-project': 'ziggurat',
  'delete-project': 'ziggurat',
  'add-desk-to-project': 'ziggurat',
  'remove-desk-from-project': 'ziggurat',
  'publish-contract': 'ziggurat',
  'publish-gall-app': 'ziggurat',
  'create-file': 'ziggurat',
  'create-file-from-template': 'ziggurat',
  'edit-file': 'ziggurat',
  'delete-file': 'ziggurat',
  'new-table': 'pokur',
  'start-game': 'pokur',
  'create-link-to-table': 'pokur' 
}

export const AppActionTypes = {
  ziggurat: 'ziggurat-action',
  pokur: 'pokur-player-action',
  pongo: 'pongo-action',
}