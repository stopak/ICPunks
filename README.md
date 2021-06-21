# ICPunks

ICPunks is a project to bring an analogue ERC-721 to Dfinity in order to faciliate creation of NFTs. 

## Installation

### Prerequisites

- [Internet Computer SDK](https://sdk.dfinity.org)
- [Node.js](https://nodejs.org) - version >=12
- [Yarn](https://nodejs.org)
- [Python](https://www.python.org)
- [Vessel@0.6.0](https://github.com/dfinity/vessel/releases/tag/v0.6.0)

## Setup

To compile the project, start by downloading the repository:

```shell

$ git clone git@github.com:stopak/ICPunks.git
$ cd ICPunks

```

If you don't have vessel yet you can install it by running an install script included in the project:

```shell

# Install vessel
$ ./scripts/vessel-install.sh

```

Double-check you have [vessel](https://github.com/dfinity/vessel) installed at version 0.6.*, then clone this repository and navigate to the `ICPunks` directory

```shell

$ vessel --version
# vessel 0.6.0

```

Start a local Internet Computer replica.

```shell
$ dfx start
```

Execute the following commands in another terminal tab in the same directory.

```shell
$ yarn # <- This installs packages from the lockfile for consistency

$ ./bootstrap.sh
```

This will deploy a local canister called `icpunks_ui`. To open the front-end, get the asset canister id by running `dfx canister id icpunks_ui`. Then open your browser, and navigate to `http://<icpunks_ui-canister-id>.localhost:8000/sign-in`.

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

# To Consider
Wallet Cannister that can display NFTs and "ERC20" tokens

How to efficiently store 1000 images, (propably one large image) tried to make canister with 100 images, build takes forever


## Tokenomics
In the long run, how to pay for cycles required to upkeep token.

## Upkeep, Transaction History
How to handle growing costs of containers upkeep. We need to pay not only for execution but also for data storage, which will increase overtime. If not handled properly it will couse the whole token to be not sustainable in the long run.

### How to deal with long transaction history
Current canisters have limit on ammount of data of 4gb. If we reach more data than that (ETH currently is about 300GB) we need to spawn new containers which incurrs additional running costs

## Inter-Canister Calls (Required for marketplaces, DeFI and others)

Identity of Inter-Canister Calls (whos is the actual sender, can we check that call was made by canister instead of user, what identity is used by calling canister)

What happens when inter-canister call fails

How to prevent canister updates (we are keeping users value, it must be protected)

How to ensure atomicity of transaction that span multiple cannisters 
