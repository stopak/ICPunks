# ICPunks

ICPunks is a project to bring an analogue ERC-721 to Dfinity in order to faciliate creation of NFTs. This repository introduces NFT canisters by showing an implementation - ICPunks - a collection of 10,000 Dfinity punks, which will be available for free to claim by community.

In the current version 0.0.1, you’ll be able to compile the local copy of ICPunks together with Dfinity network and frontend running locally. Follow setup instructions below to run it.

This project is sponsored by the Dfinity Developer Grant Programme. 

![Screen after successful deployment, v.0.0.1](https://user-images.githubusercontent.com/22591201/122807088-6e8f2100-d2cb-11eb-8518-5eb236d27c83.png)

## ToDo

Ledger Storage
Accepting Cycles as form of payment for ICPunk

UI
View of owned ICPunks

## Installation

### Prerequisites

- [Internet Computer SDK](https://sdk.dfinity.org)
- [Node.js](https://nodejs.org), version >= 12
- [Yarn](https://nodejs.org)
- [Python](https://www.python.org)
- [Vessel@0.6.0](https://github.com/dfinity/vessel/releases/tag/v0.6.0)

## Setup

The first step to setup ICPunks locally is to clone this git repository:

```shell

$ git clone git@github.com:stopak/ICPunks.git
$ cd ICPunks

```

If you don't have vessel yet you can install it by running an install script included in this project:

```shell

# Install vessel
$ ./scripts/vessel-install.sh

```

Double-check you have [vessel](https://github.com/dfinity/vessel) installed at version 0.6.*, then clone this repository and navigate to the `ICPunks` directory

```shell

$ vessel --version
# vessel 0.6.0

```

Install all dependencies for UI

```shell
yarn # <- This installs packages from the lockfile for consistency
```

Start a local Internet Computer replica.

```shell
$ dfx start --clean --background
```

Execute the following commands in another terminal tab in the same directory. (If you want to use internet-identity, skip this instruction and go to How to install local identity)

```shell
$ dfx deploy
```

This will deploy a local canister called `icpunks_ui`. To open the front-end, get the asset canister id by running `dfx canister id icpunks_assets`. Then open your browser, and navigate to `http://<icpunks_assets-canister-id>.localhost:8000`.

## Frontend Development

To run a development server with fast refreshing and hot-reloading, you can use this command in the app's root directory:

```shell
$ yarn run start
```

Your default browser will open (or focus) a tab at `localhost:3000`.

Now you can make changes to any frontend code and see instant updates, in many cases not even requiring a page refresh, so UI state is preserved between changes. Occasionally adding a CSS rule won't trigger an update, and the user has to manually refresh to see those changes.

## Internet Identity Locally

Clone and setup [the project](https://github.com/dfinity/internet-identity) and make sure that `internet_identity` is deployed, and you have the front-end available. That should allow you to do auth locally to try out the new Internet Identity service. For production, we will probably configure `identity.ic0.app` to be running this canister, but for now this is how to get it running.

In order to install II start replica in ICPunks, then go to II project, build it and deploy.

### How to install local identity
in ICPunks clean local replica

```shell
dfx stop
dfx start --clean --background

cd ..
git clone https://github.com/dfinity/internet-identity.git
cd internet-identity
```

Replica data in internet-identity cloned repo must also be cleaned (otherwise there will be errors during deployment). Replace $internet_identity with your local path to cloned repo

```shell
rm -r .dfx/local
```

Deploy internet-identity canister to ICPunks replica

```shell
II_ENV=development dfx deploy --no-wallet --argument '(null)'
```

Copy canister_ids.json from internet-identity replica to ICPunks replica

```shell
cp ./.dfx/local/canister_ids.json ../icpunks/.dfx/local/canister_ids.json
```

Now deploy ICPunks canisters

```shell
cd ../icpunks
dfx deploy
```
![Internet identity on local replica](https://user-images.githubusercontent.com/22591201/122807202-9088a380-d2cb-11eb-81f0-d1f91d2d103e.png)


# Issues and Remarks
Here, we gathered various problems we expect to solve while working on the next versions of the ICPunks. Feel free to let us know what you think!

In short:

- Wallet Canister that can display NFTs and "ERC20" tokens: how to efficiently store 1000 images, (propably one large image) tried to make canister with 100 images, build takes forever
- In the long run, how we/users should pay for cycles required to upkeep token.

## Upkeep, Transaction History
How to handle growing costs of containers upkeep. We need to pay not only for execution but also for data storage, which will increase overtime. If not handled properly it will couse the whole token to be not sustainable in the long run.

### How to deal with long transaction history
Current canisters have limit on amount of data of 4gb. If we reach more data than that (ETH currently is about 300GB) we need to spawn new containers which incurs additional running costs

### Inter-Canister Calls (required for marketplaces, DeFI and others)

The following issues are related to calls between different canisters, and we leave them here as open questions:

- Identity of Inter-Canister Calls: who is the actual sender, can we check that call was made by canister instead of user, what identity is used by calling canister?
- What happens when inter-canister call fails?
- How to prevent canister updates (we are keeping users' data, so it must be protected)?
- How to ensure atomicity of transaction that span multiple canisters? 

