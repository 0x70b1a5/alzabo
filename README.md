# ALZABO

Alzabo is a natural-language assistant for interacting with the Uqbar software suite.

## Overview
```
User intent + Uqbar docs -> Recommender => Recommendations
User intent + Recommendations -> Planner => Plan
Plan -> Alzabo => a list of real actions in userspace (sign txn, send message, etc)
```

## Install

`|install [TBD] %alzabo`

## Development Setup

### 1. Set up Chroma: 

Requires Docker.

```sh
git clone https://github.com/chroma-core/chroma 
cd chroma
sudo docker-compose up -d --build chroma
```

### 2. Set up Urbit:

Create a fakeship `~dev`, then run the steps in `setup.sh`\* in the dojo.

\* not actually a shell script; just comments for now until we can run dojo tasks from Unix terminal

### 3. Start the UI:

```sh
yarn
yarn start
```

### 4. After making changes:

```sh
# NB: if you added files to the top level of the repo 
#     that you want in the top level of the urbit ship, 
#     you may need to change copy-in.sh
./copy-in.sh 
# ~dev:dojo> |commit %alzabo
```
