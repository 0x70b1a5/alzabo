# ALZABO

Alzabo is a natural-language developer assistant for the Uqbar software suite.

## Model
```
User intent + Uqbar docs -> Recommender => Recommendations
User intent + Recommendations -> Planner => Plan
Plan -> Alzabo => a real action in userspace (sign txn, send message, etc)
```

## Install/setup

Create a fakeship `~dev`, then run the steps in `setup.sh`\* in the dojo.

\* not actually a shell script; just comments for now until we can run dojo tasks from Unix terminal

Start the UI:

```sh
yarn
yarn start
```

After making changes:

```sh
# NB: if you added files to the top level of the repo 
#     that you want in the top level of the urbit ship, 
#     you may need to change copy-in.sh
./copy-in.sh 
# ~dev:dojo> |commit %alzabo
```
