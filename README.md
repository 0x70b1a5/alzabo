# ALZABO

_Alzabo is a natural-language developer assistant for the Uqbar software suite._

"While it's always unfailingly polite, its guns always seem to be pointing not _quite_ towards the person it's speaking to..."

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