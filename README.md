# icpunks

Welcome to your new icpunks project and to the internet computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with icpunks, see the following documentation available online:

- [Quick Start](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html)
- [SDK Developer Tools](https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html)
- [Motoko Programming Language Guide](https://sdk.dfinity.org/docs/language-guide/motoko.html)
- [Motoko Language Quick Reference](https://sdk.dfinity.org/docs/language-guide/language-manual.html)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd icpunks/
dfx help
dfx config --help
```


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

### Identity of Inter-Canister Calls (whos is the actual sender, can we check that call was made by canister instead of user, what identity is used by calling canister)
### What happens when inter-canister call fails
### How to prevent canister updates (we are keeping users value, it must be protected)
### How to ensure atomicity of transaction that span multiple cannisters 
