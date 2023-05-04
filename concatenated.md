**Problem**:

<A brief description of the problem, along with necessary context.>

**Solution**:

<A brief description of how you solved the problem.>

**Notes**:

<Any other information useful for reviewers.>


# `%dev-suite` Documentation

The `%dev-suite` is comprised of `%pyro`, a ship virtualizer; `%pyre`, a virtual runtime; and `%ziggurat`, the backend for an [IDE](https://github.com/uqbar-dao/ziggurat-ui) that uses `%pyro` and `%pyre` as a foundation.

## [`%pyro` Contents](#pyro-documentation)
* [`%pyro` Quick Start](#pyro-quick-start)
* [`%pyro` Architecture](#pyro-architecture)
* [`%pyro` Inputs](#pyro-inputs)
* [`%pyro` Outputs](#pyro-outputs)
* [`%pyro` Threads](#pyro-threads)

## [`%ziggurat` Contents](#ziggurat-documentation)
* [Broad overview](#broad-overview)
* [Initial installation](#initial-installation)
* [Example usage](#example-usage)
* [Projects and desks](#project-and-desks)
* [Using threads for setup and testing](#using-threads-for-setup-and-testing)
* [Deploying contracts](#deploying-contracts)
* [Project configuration](#project-configuration)

# `%pyro` Documentation
Last updated as of Feb 07, 2023.

## `%pyro` Quick Start
```
:pyro|init ~nec                     :: initialize fake ~nec
:pyro|init ~bud                     :: initialize fake ~bud
:pyro|commit ~nec %foo              :: copy host desk %foo into ~nec
:pyro|dojo ~nec "|install our %foo" :: install %foo desk into ~nec
:pyro|dojo ~nec "=bar 5"            :: run a dojo command
:pyro|snap /baz ~[~nec ~bud]        :: take a snapshot of ~nec and ~bud named /baz
:pyro|restore /baz                  :: restore ~nec and ~bud to /baz state
:pyro|pause ~nec                    :: stop processing events for ~nec
:pyro|unpause ~nec                  :: resume processing events for ~nec
:pyro|kill ~nec                     :: remove ~nec and all it's state
:pyro|pass ~nec ...                 :: same as |pass - for experts only!
```

## `%pyro` Architecture
`%pyro` simulates individual ships, handles their state, their I/O, and snapshots

`%pyre` is the virtual runtime for %pyro ships. It handles ames sends, behn timers, iris requests, eyre responses, and dojo outputs. Not all runtime functionality is implemented - just the most important pieces.

## `%pyro` inputs
Just like a normal ship, the only interface for interacting with a `%pyro` ship is to pass it `$task-arvo`s. Using raw `$task`s requires a good knowledge of `lull.hoon`, so the most common I/O is implemented in `/lib/pyro/pyro.hoon` and `/gen/pyro/` for your convenience.

## `%pyro` outputs
###  Effects
All `$unix-effect`s can be subscribed to by an app or thread. However, `%pyre` automatically handles the most important `$unix-effects` for you. Handling unix effects by yourself in an app/thread requires a good knowledge of `lull.hoon` - to look for a specific output, look at each vane's `$gift`s.

### Scries
You can scry into a `%pyro` ship. Anthing that you can scry out of a normal ship, you can scry out of a `%pyro` ship.
```hoon
.^(wain %gx /=pyro=/i/~nec/cx/~nec/zig/(scot %da now)/desk/bill/bill)
```
Note:
1. All scries into `%pyro` ships must have a double mark at the end (e.g. `/noun/noun`, `/bill/bill`, etc.)
2. The `%pyro` ship and the [care](https://developers.urbit.org/reference/arvo/concepts/scry) must be specified at the start of the path.

There is also a convenience scry for `%gx` cares into agents running on `%pyro` ships:
```hoon
.^(mold %gx /=pyro=/~nec/myapp/my/path/goes/here/mark/mark)
```

## `%pyro` Threads
`%pyro` tests are meant to be written as threads. Common functions for using threads live in `/lib/pyro/pyro.hoon`
```
;<  ~  bind:m  (reset-ship:pyro ~nec)
;<  ~  bind:m  (reset-ship:pyro ~bud)
;<  ~  bind:m  (commit:pyro ~[~nec ~bud] our %base now)
;<  ~  bind:m  (snap:pyro /my-snapshot ~[~nec~bud]) :: TODO this isn't written
;<  ~  bind:m  (dojo:pyro ~nec "(add 2 2)")
;<  ~  bind:m  (wait-for-output:pyro ~nec "4")
;<  ~  bind:m  (poke:pyro ~nec ~bud %dap %mar !>(%payload))
;<  ~  bind:m  (restore:pyro /my-snapshot) :: TODO this isn't written
```

---

# `%ziggurat` documentation

The `%ziggurat` dev suite is built on top of the `%pyro` ship virtualizer and is the backend for the [Ziggurat IDE](https://github.com/uqbar-dao/ziggurat-ui).

Last updated as of Apr 10, 2023.

## Broad overview

`%ziggurat` is the backend for the [Ziggurat IDE](https://github.com/uqbar-dao/ziggurat-ui).
`%pyro` is a ship virtualizer used to run a network of `%pyro` ships and used by `%ziggurat`.

`%pyro` is paired with `%pyre`, an app that plays the role of the runtime for `%pyro`.
For example, `%pyre` picks up ames packets sent from one `%pyro` ship and passes them to the recipient `%pyro` ship.

`%pyro` can snapshot and load `%pyro` ship state.

`%ziggurat` runs threads to put `%pyro` ships into specific states and test functionality of contracts and apps.
These threads can either be added by hand to `/zig/ziggurat/[thread-name]/hoon` or added via the `test-steps` UI.

`%ziggurat` is specifically designed to make smart contract and Gall agent development easy.
As such, `%ziggurat` is the premier development environment for integrated on- and off-chain computing.

##  Initial installation

### Fakeship installation

1. Set env vars pointing to repo-containing and ship-containing dirs.
   ```bash
   export REPO_DIR=~/git
   export SHIP_DIR=~/urbit
   ```
2. Create a fake `~zod`.
   ```bash
   cd $SHIP_DIR
   ./vere -F zod
   ```
3. Clone the official Urbit repository and add required repositories, including this one, as submodules.
   This structure is necessary to resolve symbolic links to other desks like `base-dev` and `garden-dev`.
   ```bash
   cd $REPO_DIR
   git clone https://github.com/urbit/urbit.git
   cd ${REPO_DIR}/urbit/pkg

   git submodule add git@github.com:uqbar-dao/dev-suite.git
   git submodule add git@github.com:uqbar-dao/uqbar-core.git
   git submodule add git@github.com:uqbar-dao/zig-dev.git
   ```
4. Set submodules to proper branches -- only required while WIP.
     ```bash
     cd uqbar-core
     git checkout hf/ziggurat-cleanup
     cd ..
     cd dev-suite
     git checkout next/suite
     cd ..
     ```
5. On the fake `~zod`, create and mount appropriate desks.
   ```hoon
   |new-desk %suite
   |new-desk %zig
   |new-desk %zig-dev
   |mount %suite
   |mount %zig
   |mount %zig-dev
   ```
6. Copy submodule contents into the appropriate desks.
   ```bash
   rm -rf ${SHIP_DIR}/nec/suite/* && cp -RL ${REPO_DIR}/urbit/pkg/dev-suite ${SHIP_DIR}/nec/suite
   rm -rf ${SHIP_DIR}/nec/zig/* && cp -RL ${REPO_DIR}/urbit/pkg/uqbar-core ${SHIP_DIR}/nec/zig
   rm -rf ${SHIP_DIR}/nec/zig-dev/* && cp -RL ${REPO_DIR}/urbit/pkg/zig-dev ${SHIP_DIR}/nec/zig-dev
   ```
7. On the fake `~zod`, commit the files.
   ```hoon
   |commit %suite
   |commit %zig
   |commit %zig-dev
   ```
8. Install `%suite`.
   As a part of installation, `%pyro` will start three virtualized ships (`~nec`, `~bud`, and `~wes`) and the `%zig-dev` project will be initialized, installing the `%zig` desk on each `%pyro` ship and starting a testnet, hosted by `~nec`, the same as if these instructions had been followed: https://github.com/uqbar-dao/uqbar-core#starting-a-fakeship-testnet
   ```hoon
   |install our %suite
   ```

### Liveship installation

Coming soon.

## Example usage

### Import %pokur, set up a table, and join it

As a more real-world example, import the %pokur-dev project.

Similar to in the [installation instructions](#fakeship-installation) above, add the pokur-dev repo as a submodule, and get the files into the %pokur-dev desk:
```
#  In terminal
cd ${REPO_DIR}/urbit/pkg
git submodule add git@github.com:uqbar-dao/pokur-dev.git

::  On ship
|new-desk %pokur-dev

#  In terminal
rm -rf ${SHIP_DIR}/nec/pokur-dev && cp -RL ${REPO_DIR}/urbit/pkg/pokur-dev

::  On ship
|commit %pokur-dev
```

Then, adding %pokur-dev using %new-project will create a new project and run the [pokur-dev configuration file](https://github.com/uqbar-dao/pokur-dev/blob/master/zig/configuration/pokur-dev.hoon).

```hoon
:ziggurat &ziggurat-action [%pokur-dev %pokur-dev ~ %new-project ~ !>(~)]
```

The project will have a functional testnet with the escrow contract deployed, with `~nec` as the pokur-host and `~bud` leading a table.

Also included in the %pokur-dev project is a thread that causes `~wes` to join `~bud`s table.
It can be run as follows:
```hoon
::  Examine state of %pokur app running on ~bud: note the table hosted by ~nec and led by ~bud
:pyro|dojo ~bud ":pokur +dbug"

:ziggurat &ziggurat-action [%pokur-dev %pokur-dev ~ %queue-thread %ziggurat-wes-join-table %fard !>(~)]
:ziggurat &ziggurat-action [%pokur-dev %pokur-dev ~ %run-queue ~]

::  Examine state of %pokur app running on ~bud: note the table hosted by ~nec and led by ~bud now has ~wes as a player
:pyro|dojo ~bud ":pokur +dbug"
```

Some other stuff you may want to do:

```hoon
::  Snapshot at any given state to be able to restore to it later:
::   (The `/my-state/0` is an arbitrary `path` that is a label).
:pyro|snap /my-state/0 ~[~nec ~bud ~wes]

::  Restore to a snapshot:
:pyro|restore /my-state/0
```

### `update:zig`

Many pokes will result in an error or change in state that frontends or other apps need to know about.
`%ziggurat` returns `update`s that specify the changed state or the error that occurred.
Frontends or apps should subscribe to `/project/[project-name]` to receive these `update`s.

In addition, scries will also often return `update:zig`.

`update:zig` takes the form of:
* A tag, indicating the action or scry that triggered the update or the piece of state that changed,
* `update-info:zig`, which itself contains metadata about the state/triggering action:
  * `project-name`,
  * `desk-name`,
  * `source`: where did this `update` or error originate from?
  * `request-id`: pokes may include a `(unit @t)`, an optional `request-id` to make finding the resulting update easier; if a poke caused this `update`, and it included a `request-id`, it is copied here.
* `payload`: a piece of data or an error.
  If the `update` is reporting a success this may contain data about the updated state.
  If the `update` is reporting a failure, this includes a:
  * `level`: like a logging level (info, warning, error): how severe was this failure,
  * `message`: an description of the error.
* other optional metadata that should be reported whether a success or a failure.

## Projects and desks

`%ziggurat` projects are sets of desks that maintain state amongst them.
For example, the `%pokur-dev` project comes with the `%zig` desk to run an Uqbar testnet and the `%pokur` desk to run the pokur contracts (specifically escrow) and apps (specifically %pokur and %pokur-host).

A project can be started from scratch using the IDE.

Projects can also be imported.

Imported projects may optionally have a configuration thread.
See [project configuration](#project-configuration) for further discussion.

## Using threads for setup and testing

Aside from running the initial configuration thread when importing a project, threads are used to put `%pyro` ships into specific, consistent states and to run tests.
The [ziggurat threads lib](https://github.com/uqbar-dao/dev-suite/blob/master/lib/zig/ziggurat/threads.hoon) is provided to make manipulation of and testing with `%pyro` ships easier.
Some examples of threads used for testing actions coordinating multiple ships are `%zig-dev`s [`send-bud`](https://github.com/uqbar-dao/zig-dev/blob/master/ted/ziggurat/send-bud.hoon) and `%pokur-dev`s [`wes-join-table`](https://github.com/uqbar-dao/pokur-dev/blob/master/ted/ziggurat/wes-join-table.hoon).

Threads can either be written directly or created through the IDE UI, in which case they are presented in a simplified form, "test steps".

### Test steps

`test-steps` are sequences of `test-step`s.
A `test-step` can be a `%poke`,`%scry`, `%wait`, or `%dojo`.
`%poke` and `%scry` are pretty self-explanatory; `%wait` pauses for the given `@dr`.
`%dojo` executes the given string in the Dojo of the given `%pyro` ship.

`test-steps` are compiled to a thread and run in the same way hand-written threads are.

## Deploying contracts

Contracts can be deployed to the `%pyro` ship testnet for a project using the `%deploy-contract` poke:
```hoon
:ziggurat &ziggurat-action [%foo ~ %deploy-contract town-id=0x0 /con/compiled/nft/jam]
```

## Project configuration

Projects can be configured so that they are in a predictable state when imported.
Configuration is accomplished by a `hoon` file that lives at `/zig/configuration/[project-name]/hoon`, and it must have a `$`-arm that returns a `form:m`.
That `$`-arm is run when the project is installed.
For examples, see the [zig-dev configuration file](https://github.com/uqbar-dao/zig-dev/blob/master/zig/configuration/zig-dev.hoon) and the [pokur-dev configuration file](https://github.com/uqbar-dao/pokur-dev/blob/master/zig/configuration/pokur-dev.hoon).

### State views

Access the state of apps that import the dbug library running on `%pyro` ships using state views in the IDE UI.
Projects can be configured to come pre-loaded with state views.
State view files live in either `/zig/state-views/agent` or `/zig/state-views/chain` -- which retrieve data from Gall apps or the Uqbar chain respectively.
State view files contain Hoon that is directly analogous to Hoon that would be input to the `+dbug` generator.
For example,
```hoon
::  Get entire %ziggurat state.
:ziggurat +dbug [%state '-']

::  Get %zig-dev project from within %ziggurat state.
:ziggurat +dbug [%state '(~(get by projects) %zig-dev)']
```

To load pre-defined state views at import-time, `/zig/state-views/[project-name]/hoon` must exist.
For examples of that file format, see [zig-dev](https://github.com/uqbar-dao/zig-dev/blob/master/zig/state-views/zig-dev.hoon) and [pokur-dev](https://github.com/uqbar-dao/pokur-dev/blob/master/zig/state-views/pokur-dev.hoon).


##  purely peer to peer org-comms

PONGO:
  Peers Only Naively Gossipping Online

set of ships in a channel is determined by (set ship) in org stored on-chain

so, everyone always has an up-to-date representation of who to send messages to

therefore, you can directly poke each channel member with your messages --
you can also receive all messages directly from their sender.

(if you have a comms issue with a single ship in the group, you should be able to
ask another peer to forward them to you?)

ordering is not well-regulated by default -- messages can reach participants
in different orders, resulting in confusion

vector clock-esque solution:

existing messages:
[1 2 3 4 5 6]

user A posts message 7 by including the ID of message they last saw (6)
user B posts message 7 in the same way, having not seen user A's message yet


##  silly little integration

- new convo type, org-type
- router just adds and removes every time it gets a ping from %orgs


##  decentralized wager system

PONGO:
  Putting Our Natural Graph On-chain

one ship creates a "wager" and requests all ships with a certain tag in their PONGO network to respond with an "outcome"

```hoon
+$  wager
  :-  desc=@t
  $%  [%value @]
      [%choice (list wager)]
      [%complex *]
  ==
::
+$  outcome
  $%  [%value @]
      [%choice @]  ::  index in %choice list
      [%complex *]
  ==
```

when a ship is requested to respond, it is given a push notification

the UI allows user to see the source of the wager and the description+structure of the wager

the user indicates an outcome and signs it as a ring signature, with set of ships being the tagged group in PONGO, then gossips ring signature to group -- signers build on gossiped ring





#  pongo

Use pongo from the command line: pongo is helpfully configured to print in yellow all the JSON that will be sent along the `/updates` path as it runs.

- install %pongo desk in two or more ships. i'll be using `~tes` and `~dev`

- on `~tes`, run: `:pongo|new 'squidchat72' ~[~dev]`. you will see a conversation id appear.

- on `~dev`, run: `:pongo|join <conversation-id>`

- on either ship, you can now send message like so:
  `:pongo|message <conversation-id> 'your message'`

- you can edit messages you've previously sent like so:
  `:pongo|edit <conversation-id> <message-id> 'new message text'`

- you can react to messages you've seen:
  `:pongo|react <conversation-id> <message-id> '🦑'`

- you can leave a conversation:
  `:pongo|leave <conversation-id>`

The yellow "sending" receipts mean that a message was processed by your urbit ship and sent out to other members of the conversation. This could be interpreted as "sent" in the user-facing display as an indicator that they are in fact connected to their urbit backend.

The yellow "delivered" receipts mean that a message was received (not seen, but deposited into their urbit ship) by *all* members in a conversation. This feature is currently artificially limited to conversations with 5 or fewer members. Try turning off one fakeship and sending messages to see how this works in practice. **Note**: ships that have us blocked will still send "delivered" receipts, but will not save or ever see the actual message.

Reactions are not limited to emojis, or validated in any way. I should add some handling around that. You can react again to the same message to override your existing reaction if any. Removing a reaction should probably just be reacting with an empty ''.

**You can block and unblock ships from messaging you with these pokes**:
- `{"block":{"who":"~bus"}}`
- `{"unblock":{"who":"~bus"}}`

**To search messages by phrase (exact matches only)**:
- First, come up with a unique hex identifier for the search (can be random)
- Subscribe to path `/search-results/<your-hex-id>`
- Poke with structure:

  *WEIRD FORMATTING*: "only-in" should be hex number WITHOUT dots or leading 0x. "only-author" should have no leading ~
  ```
  {"search":
     {"uid":"<your-hex-id>",
      "only-in":"<conversation-id>",
      "only-author:"zod",
      "phrase":"what you're searching for"
      }
    }
  ```
- You can set "only-author" to null to search from all authors. In the future, you will be able to set "only-in" to null to search all conversations. Currently limited to single conversation :(
- After user navigates away from search, do this poke:
  `{"cancel-search":{"uid":"<your-hex-id>"}}`

-----

For structure of all pokes see `/mar/pongo/action.hoon`.

To see the JSON representation of scries, use these in dojo:
- `(crip (en-json:html .^(json %gx /=pongo=/all-messages/<conversation-id>/json)))`
- `(crip (en-json:html .^(json %gx /=pongo=/conversations/json)))`

**Note**: leaving a conversation does *not* delete its record in the database, so you will still be able to scry a read-only archive of it. We can add a way to permanently delete these later!

I will add more specific scries very soon.

# Ziggurat UI for Uqbar

The UI for the Uqbar Ziggurat app.

## Development

Modify the `target` in `/src/setupProxy.js` to point at your urbit ship and then run `yarn start`.

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000/) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Build the glob in a fakezod

```bash
#!/bin/sh
cd ~/urbit-git/pkg
rm -rf zod
cp -RL bakzod zod # where bakzod is a copy of a ship with %suite desk mounted
cd ~/ziggurat-ui
yarn build
rm build/static/js/*.js.map*
rm build/static/css/*.css.map*
cp -RL build/ ~/urbit-git/pkg/zod/suite
cp ~/urbit-git/pkg/zod/suite/mar/png.hoon ~/urbit-git/pkg/zod/suite/mar/jpg.hoon
# urbit> |commit %suite
# urbit> -garden!make-glob %suite /build
# glob will be in ~/urbit-git/pkg/zod/.urb/put/0vsomethingsomething.glob
```


**Problem**:

<A brief description of the problem, along with necessary context.>

**Solution**:

<A brief description of how you solved the problem.>

**Notes**:

<Any other information useful for reviewers.>


# Uqbar Core

Uqbar Core is the Uqbar chain.
It contains code for the Gall apps required to simulate the ZK rollup to Ethereum, to sequence transactions in order to run a town, and the user application suite: the `%wallet` for chain writes, the `%indexer` for chain reads, and `%uqbar`, a unified read-write interface.


## Contents

* [Project Structure](#project-structure)
* [Initial Installation](#initial-installation)
* [Starting a Fakeship Testnet](#starting-a-fakeship-testnet)
* [Joining an Existing Testnet](#joining-an-existing-testnet)
* [Why Route Reads and Writes Through `%uqbar`](#why-route-reads-and-writes-through-uqbar)
* [Compiling Contracts and the Standard Library](#compiling-contracts-and-the-standard-library)
* [Deploying Contracts to a Running Testnet](#deploying-contracts-to-a-running-testnet)
* [Glossary](#glossary)


## Project Structure

![Project Structure](/assets/220901-project-structure.png)

The `%rollup` app simulates the ZK rollup to Ethereum L1.
The `%sequencer` app runs a town, receiving transactions from users and batching them up to send to the `%rollup`.
The user suite of apps include:
* `%wallet`: manages key pairs, tracks assets, handles writes to chain
* `%indexer`: indexes batches, provides a scry interface for chain state, sends subscription updates
* [`%uqbar`](#why-route-reads-and-writes-through-uqbar): wraps `%wallet` and `%indexer` to provide a unified read/write interface

The user suite of apps interact with the `%rollup` and `%sequencer` apps, and provide interfaces for use by Urbit apps that need to read or write to the chain.

A single `%rollup` app will be run on a single ship.
One `%sequencer` app will run each town.
Any ship that interacts with the chain will run the `%wallet`, `%indexer`, and `%uqbar` apps.

In the future, multiple `%sequencer`s may take turns sequencing a single town.
In the future, with remote scry, users will not need to run their own `%indexer`, and will instead be able to point their `%uqbar` app at a remote `%indexer`.


## Initial Installation

1. Make sure Git LFS is installed, [see instructions](https://docs.github.com/en/repositories/working-with-files/managing-large-files/installing-git-large-file-storage).
   Some large binaries are stored on Git LFS, and so installation will not work without Git LFS.
2. Clone the official Urbit repository and add this repository as a submodule.
   This structure is necessary to resolve symbolic links to other desks like `base-dev` and `garden-dev`.
   ```bash
   cd ~/git  # Replace with your chosen directory.

   git clone git@github.com:urbit/urbit.git
   cd urbit/pkg
   git submodule add git@github.com:uqbar-dao/uqbar-core.git uqbar-core
   ```
3. Either build or install the Urbit binary, then boot a development fakeship:
   ```bash
   ./urbit -F nec
   ```
4. In the Dojo of the fakeship, set up a `%zig` desk, where we will copy the files in this repo:
   ```hoon
   |merge %zig our %base
   |mount %zig
   ```
5. In a new terminal, copy the files from this repo into the `%zig` desk:
   ```bash
   cd ~/git/urbit/pkg  # Replace with your chosen directory.

   rm -rf nec/zig/*
   cp -RL uqbar-core/* nec/zig/
   ```
6. In the Dojo of the fakeship, commit the copied files and install.
   ```hoon
   |commit %zig
   |install our %zig
   ```
7. Run tests, if desired, in the Dojo.
   ```hoon
   ::  Run all tests.
   -test ~[/=zig=/tests]

   ::  Run only contract tests.
   -test ~[/=zig=/tests/contracts]
   ```


## Starting a Fakeship Testnet

To develop this repo or new contracts, it is convenient to start with a fakeship testnet.
First, make sure the fakeship you're using is in the [whitelist](https://github.com/uqbar-dao/uqbar-core/blob/3d0514e366435553abbe4fecde7e28e43f77a45d/lib/zig/rollup.hoon#L11-L17).

Uqbar provides a generator to set up a fakeship testnet for local development.
That generator, used as a poke to the `%sequencer` app as `:sequencer|init`, populates a new town with some [`item`](#item)s: [`pact`](#pact) (contract code) and [`data`](#data) (contract data).
Specifically, contracts for zigs tokens, NFTs, and publishing new contracts are pre-deployed.
After [initial installation](#initial-installation), start the `%rollup`, initialize the `%sequencer`, set up the `%uqbar` read-write interface, and configure the `%wallet` to point to some [pre-set assets](#accounts-initialized-by-init-script), minted in the `:sequencer|init` poke:
```hoon
:rollup|activate
:indexer &indexer-action [%set-sequencer 0x0 [our %sequencer]]
:indexer &indexer-action [%set-rollup [our %rollup]]
:sequencer|init our 0x0 0xc9f8.722e.78ae.2e83.0dd9.e8b9.db20.f36a.1bc4.c704.4758.6825.c463.1ab6.daee.e608
:uqbar &wallet-poke [%import-seed 'uphold apology rubber cash parade wonder shuffle blast delay differ help priority bleak ugly fragile flip surge shield shed mistake matrix hold foam shove' 'squid' 'nickname']
```


If you want to perform lots of batching locally, you'll want to get an API key for etherscan to make more requests. The sequencer agent uses this API to fetch the most recent block height for ETH. [Get a free API key from etherscan](https://etherscan.io/apis) and save in %sequencer like so:
```hoon
:sequencer &sequencer-town-action [%set-block-height-api-key 'YOUR_KEY']
```



### Example: writing to chain with `%wallet`

After [starting the testnet](#starting-up-a-new-testnet), send transactions using the `%wallet`.
Note that pokes here are to `%uqbar`.
Pokes with the `%wallet-poke` mark are [routed through `%uqbar`](#why-route-reads-and-writes-through-uqbar) to `%wallet`; the pokes below could just as easily be sent to `%wallet`.

First, create a pending transaction.
The `%wallet` will send the transaction hash on a subscription wire as well as print it in the Dojo.
```hoon
::  Send zigs tokens.
:uqbar &wallet-poke [%transaction ~ from=0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70 contract=0x74.6361.7274.6e6f.632d.7367.697a town=0x0 ship=~ action=[%give to=0xd6dc.c8ff.7ec5.4416.6d4e.b701.d1a6.8e97.b464.76de amount=123.456 item=0x7810.2b9f.109c.e44e.7de3.cd7b.ea4f.45dd.aed8.054c.0b52.b2c8.2788.93c6.5bb4.bb85]]

::  Send an NFT.
:uqbar &wallet-poke [%transaction ~ from=0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70 contract=0xb526.8432.294e.1c99.de7f.0cd9.2634.332a.28d3.9b76.4549.b51f.0fb2.80d5.91f1.1f5a town=0x0 ship=~ action=[%give-nft to=0xd6dc.c8ff.7ec5.4416.6d4e.b701.d1a6.8e97.b464.76de item=0xd483.3b10.4b1a.5805.ef16.017f.d33f.a1f8.d9d9.865a.0da6.aaec.0a94.9613.59de.1734]]

::  Use the custom transaction interface to send zigs tokens.
:uqbar &wallet-poke [%transaction ~ from=0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70 contract=0x74.6361.7274.6e6f.632d.7367.697a town=0x0 ship=~ action=[%noun [%give to=0xd6dc.c8ff.7ec5.4416.6d4e.b701.d1a6.8e97.b464.76de amount=69.000 from-account=0x7810.2b9f.109c.e44e.7de3.cd7b.ea4f.45dd.aed8.054c.0b52.b2c8.2788.93c6.5bb4.bb85]]]
```

Then, sign the transaction and assign it a gas budget.
For example, for the zigs token transaction above:
```hoon
::  Sign with hot wallet.
:uqbar &wallet-poke [%submit from=0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70 hash=[yourhash] gas=[rate=1 bud=1.000.000]]
```
Transactions can also be signed using a hardware wallet, via `%submit-signed`.


### Submitting a `%batch`

Each signed transaction sent to the `%sequencer` will be stored in the `%sequencer`s `basket` (analogous to a mempool).
To run the transactions, create the new batch with updated town state, and send it to the `%rollup`, poke the `%sequencer`:
```hoon
:sequencer|batch
```

Alternatively, use `%batcher-interval` or `%batcher-threshold` to automatically create batches.


#### `%batcher-interval`

`%batcher-interval` creates batches after some time period has passed.
However, if `%sequencer` has not received any transactions, it will not create a batch for that period.
```hoon
|rein %zig [& %batcher-interval]

::  Batch every 30 seconds.
:batcher-interval `~s30

::  Stop periodic batching.
:batcher-interval ~
```


#### `%batcher-threshold`

`%batcher-threshold` creates batches after some number of transactions has been received by `%sequencer`.
```hoon
|rein %zig [& %batcher-threshold]

::  Batch every 10 transactions.
:batcher-threshold `10

::  Stop automatic batching.
:batcher-threshold ~
```

### Example: reading chain state with `%indexer`:

Chain state can be scried inside Urbit or from outside Urbit using the HTTP API.
Consult the docstring of `app/indexer.hoon` for a complete listing of scry paths.
The scries below could instead be directed directly to `%indexer`, but [routing them through `%uqbar` has some advantages](#why-route-reads-and-writes-through-uqbar).
When routed through `%uqbar`, as below, `/indexer` must be prepended to the path.

1. Scrying from the Dojo.
   ```hoon
   =ui -build-file /=zig=/sur/zig/indexer/hoon

   ::  Query all fields for the given hash.
   .^(update:ui %gx /=uqbar=/indexer/hash/0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70/noun)

   ::  Query for the history of the given item.
   .^(update:ui %gx /=uqbar=/indexer/item/0x89a0.89d8.dddf.d13a.418c.0d93.d4b4.e7c7.637a.d56c.96c0.7f91.3a14.8174.c7a7.71e6/noun)

   ::  Query for the current state of the given item.
   .^(update:ui %gx /=uqbar=/indexer/newest/item/0x89a0.89d8.dddf.d13a.418c.0d93.d4b4.e7c7.637a.d56c.96c0.7f91.3a14.8174.c7a7.71e6/noun)
   ```

2. Scrying from outside Urbit using the HTTP API.
   The following examples assume `~nec` is running on `localhost:8080`.
   ```bash
   export nec_COOKIE=$(curl -i -X POST localhost:8080/~/login -d 'password=lidlut-tabwed-pillex-ridrup' | grep set-cookie | awk '{print $2}' | awk -F ';' '{print $1}')

   # Query all fields for the given hash.
   curl --cookie "$nec_COOKIE" localhost:8080/~/scry/uqbar/indexer/hash/0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70.json | jq

   # Query for the history of the given item.
   curl --cookie "$nec_COOKIE" localhost:8080/~/scry/uqbar/indexer/item/0x89a0.89d8.dddf.d13a.418c.0d93.d4b4.e7c7.637a.d56c.96c0.7f91.3a14.8174.c7a7.71e6.json | jq

   # Query for the current state of the given item.
   curl --cookie "$nec_COOKIE" localhost:8080/~/scry/uqbar/indexer/newest/item/0x89a0.89d8.dddf.d13a.418c.0d93.d4b4.e7c7.637a.d56c.96c0.7f91.3a14.8174.c7a7.71e6.json | jq
   ```

### Accounts initialized by init script

Below are listed the seed phrases, encryption passwords, and key pairs initialized by the `:sequencer|init` call [above](#starting-a-fakeship-testnet).
Note in that section we make use of the first of these accounts to set up the `%wallet` (and `%sequencer`) on `~nec`.

```hoon
::  Account holding a data with 300 zigs.
::  Seed, password, private key, public key:
uphold apology rubber cash parade wonder shuffle blast delay differ help priority bleak ugly fragile flip surge shield shed mistake matrix hold foam shove
squid
0xc9f8.722e.78ae.2e83.0dd9.e8b9.db20.f36a.1bc4.c704.4758.6825.c463.1ab6.daee.e608
0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70

::  Account holding a data with 200 zigs:
::  Seed, password, private key, public key:
post fitness extend exit crack question answer fruit donkey quality emotion draw section width emotion leg settle bulb zero learn solution dutch target kidney
squid
0x38b7.e413.7f0d.9d05.ae1e.382d.debd.cc79.3f3a.6be3.912b.1eea.33e2.dd94.bd1c.d330
0xd6dc.c8ff.7ec5.4416.6d4e.b701.d1a6.8e97.b464.76de

::  Account holding a data with 100 zigs:
::  Seed, password, private key, public key:
flee alter erode parrot turkey harvest pass combine casual interest receive album coyote shrug envelope turtle broken purity wear else fluid transaction theme buyer
squid
0xea88.44f4.1573.d220.8e6e.a784.a3ac.4dcb.5070.dee0.7899.01ba.7ce8.0042.6897.bf8e
0x5da4.4219.e382.ad70.db07.0a82.12d2.0559.cf8c.b44d
```


## Joining an Existing Testnet

To add a new ship to a fakeship testnet or to a live testnet, follow these instructions.
First make sure your ship is on the [whitelist](https://github.com/uqbar-dao/ziggurat/blob/master/lib/rollup.hoon) of the ship hosting the rollup simulator.
The following two examples assume `~nec` is the host:


### Indexing on an existing testnet
```hoon
:indexer &indexer-action [%set-sequencer [~nec %sequencer]]
:indexer &indexer-action [%set-rollup [~nec %rollup]]
:indexer &indexer-action [%bootstrap [~nec %indexer]]
```
In this example, not all the hosts need be the same ship.
To give a specific example, `~nec` might be running the `%rollup`, while `~bus` runs the `%sequencer` for town `0x0` and also the `%indexer`.
Every user who wishes to interact with the chain must currently run their own `%indexer`, so there will likely be many options to `%bootstrap` from.


### Sequencing on an existing testnet

To start sequencing a new town:
```hoon
:sequencer|init ~nec <YOUR_town_ID> <YOUR_PRIVATE_KEY>
```

`%sequencer` does not create batches automatically unless configured to do so.
Instructions for how to manually or automatically create batches are [here](#submitting-a-batch).


## Why Route Reads and Writes Through `%uqbar`

The `%uqbar` Gall app serves as a unified read-write interface to the Uqbar chain.
It routes writes to `%wallet`, and reads to either `%indexer` or `%wallet`.

There are two main benefits to this "middleman":
1. Extensibility.
   Gall apps that access the chain using `%uqbar` make it easy for third-party developers to create `%indexer` and `%wallet` variants.
   Rather than requiring every chain-enabled Gall app to change to, say, `%orbis-tertius-indexer`, a single change can be made in the state of `%uqbar`, and requests will be routed to Orbis Tertius' third-party indexer.
   A similar argument holds for the `%wallet`.
2. Robustness & simplicity for chain-enabled Gall app developers.
   With remote scry, users will no longer have to run an `%indexer` themselves.
   Users input where to route reads and writes to in `%uqbar` once.
   Then all chain-enabled Gall apps can simply send requests to `%uqbar`.
   Further, the logic for fallbacks in case one `%indexer` provider is down can all live in `%uqbar`, rather than having to be rewritten in every chain-enabled Gall app.

Therefore, we strongly recommend devs to route read/write requests through `%uqbar`, rather than directly to `%indexer` or `%wallet`.


## Compiling Contracts and the Standard Library

Contracts and the standard library must be compiled before they can be used.
Compilation makes use of generators that can be easily run in the Dojo.
The compiled `.noun` files can be found in the `put` directory of your pier.
For example, if you compile using a fakeship named ~nec, the `noun` files can be found within `nec/.urb/put`.

To recompile the standard library, use
```hoon
.smart-lib/noun +zig!mk-smart
```

Contracts can be compiled using variations of the following command.
Here, the `zigs` contract is compiled.
In general, replace `zigs` with the name of any other contract.
```hoon
.zigs/jam +zig!compile /=zig=/con/zigs/hoon
```


## Deploying Contracts to a Running Testnet

Contracts are deployed using the `publish` contract found in this repo at `con/publish.hoon`.
The `publish` contract is usually deployed on `town`s in the `pact` with ID `0x1111.1111`.
For example, to deploy the `multisig` contract, first [compile it](#compiling-contracts-and-the-standard-library).
Then place it at `con/compiled/multisig.noun`.
To deploy on town `0x0`, in the Dojo:
```hoon
=contract-path /=zig=/con/compiled/multisig/jam
=contract-jam .^(@ %cx contract-path)
=contract [- +]:(cue contract-jam)
:uqbar &wallet-poke [%transaction ~ from=[youraddress] contract=0x1111.1111 town=0x0 action=[%noun [%deploy mutable=%.n cont=contract interface=~]]]
```


## Glossary

### `batch`
A `batch` in a rollup is analogous to a block in a blockchain.
`batch`es have a definite order, and are produced by a `%sequencer` for a given `town`.


### `transaction`

A transaction consists of three parts, a signature, calldata, and a `shell`.
The `shell` is the same for all `transaction`s, and contains information about who the transaction is from, what contract it called, what gas budget was allocated and so on.
`calldata` is a `(pair @tas noun)` that has a form depending on the target contract.


### `item`

An `item` is either a piece of data (a `data`) or a piece of code (a `pact`).


### `data`

A `data` is a piece of data associated with a specific `pact` that is `lord` over it.
For example, a `data` of the `zigs` `pact` might be an `account`, holding some number of tokens.
Or a `data` of the `nft` `pact` might be a particular `nft` with certain characteristics.


### `pact`

A `pact` is a piece of code: it is a contract.
For example, the `zigs` contract that governs the base rollup tokens is a `pact`, and the `nft` contract that enables NFTs to be held and sent is another.


### `town`

A segment of chain-state within the Uqbar rollup.
A `%sequencer` runs a `town`, receiving transactions from users, executing them, and then sending the updated state to the `%rollup`.


## Install %nectar from ~bacrys:
`|install ~bacrys %nectar`
This desk contains the agents `%nectar` and `%social-graph` matching this repo.

###  %nectar: RDBMS on Urbit

%nectar is a relational database. It's a work-in-progress.

###  %social-graph

%social-graph is a tool for storing relationships between ships, addresses, and entities.
https://hodzod.bacrys.org/blog/introducing-social-graph


# pokur
Urbit Texas Hold'em app

**under construction**

**real monies game:**

**make sure to pull latest from `uqbar-core/dr/wallet-api-upgrades`.**

Copy `con/compiled/escrow.jam` from here into that location in the `uqbar-core` repo.

Copy `gen/sequencer/init.hoon` from here into `uqbar-core`, replacing the file at that location.

Install the %zig desk on both ships.

Run the normal startup commands in `uqbar-core` README to set up **~nec** as the rollup host and sequencer:
```hoon
:rollup|activate
:indexer &indexer-action [%set-sequencer [our %sequencer]]
:indexer &indexer-action [%set-rollup [our %rollup]]
:sequencer|init our 0x0 0xc9f8.722e.78ae.2e83.0dd9.e8b9.db20.f36a.1bc4.c704.4758.6825.c463.1ab6.daee.e608
:uqbar &wallet-poke [%import-seed 'uphold apology rubber cash parade wonder shuffle blast delay differ help priority bleak ugly fragile flip surge shield shed mistake matrix hold foam shove' 'squid' 'nickname']
```

Many of these instructions can be better done through the wallet frontend.

Run the following commands on **~rus**:
```hoon
:indexer &indexer-action [%set-sequencer ~nec %sequencer]
:indexer &indexer-action [%set-rollup ~nec %rollup]
:indexer &indexer-action [%bootstrap ~nec %indexer]
:uqbar &wallet-poke [%import-seed 'post fitness extend exit crack question answer fruit donkey quality emotion draw section width emotion leg settle bulb zero learn solution dutch target kidney' 'squid' 'nickname']
```

Now, we can start a moneyed game.
We'll use zigs tokens for a sit n go.

*NOTE: %pokur-host sends a poke to %wallet upon install, allowing it to automatically sign and submit transactions.*

On **~nec**:

Make a table. This is a sit'n'go table that awards 100% of winnings to 1st place:
```hoon
:pokur-host &pokur-host-action [%host-info our 0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70 [0xabcd.abcd 0x0]]
:pokur &pokur-player-action [%set-our-address 0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70]
:pokur &pokur-player-action [%new-table *@da ~nec `[`@ux`'zigs-metadata' 'ZIG' 1.000.000.000.000.000.000 0x0] 2 2 [%sng 1.000 ~m60 ~[[1 2] [2 4] [4 8]] 0 %.n ~[100]] %.y %.y ~m10]
```
Fill in tx hash, submit and sequence:
```hoon
:uqbar &wallet-poke [%submit from=0x7a9a.97e0.ca10.8e1e.273f.0000.8dca.2b04.fc15.9f70 hash=[yourhash] gas=[rate=1 bud=1.000.000]]
:sequencer|batch
```

Now the table will be created and available from host. ~rus should see the update -- now we can join with **~rus**.

Make the join transaction:
```hoon
:pokur &pokur-player-action [%set-our-address 0xd6dc.c8ff.7ec5.4416.6d4e.b701.d1a6.8e97.b464.76de]
:pokur &pokur-player-action [%join-table id=[table-id] buy-in=0 public=%.y]
:uqbar &wallet-poke [%submit from=0xd6dc.c8ff.7ec5.4416.6d4e.b701.d1a6.8e97.b464.76de hash=[yourhash] gas=[rate=1 bud=1.000.000]]
```

Then, run a batch on **~nec** so this txn goes through:
```hoon
:sequencer|batch
```

You can now start the game on **~nec**. At the end, the winning ship should be awarded 2.000 zigs!
```hoon
:pokur &pokur-player-action [%start-game <table-id>]
```

----------------------

**fake monies game:**

On ship ~nec:
```
:pokur &pokur-player-action [%new-table *@da ~nec ~ 2 2 [%sng 1.000 ~m60 ~[[1 2] [2 4] [4 8]] 0 %.n ~[100]] %.y %.y ~m10]
```

(look at "lobbies available" print to find table id -- this prints twice, is ok)

On ship ~rus:
```
:pokur &pokur-player-action [%join-table <id> public=%.y]
```

On ~nec:
```
:pokur &pokur-player-action [%start-game <id>]
```

On ~rus:
```
:pokur|bet 1  ::  call big blind
```

can play game from here using format `:pokur|[bet/check/fold]` where only bet takes any further input



