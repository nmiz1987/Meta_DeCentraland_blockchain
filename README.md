# Meta CentraLand - Blockchain

This project was built as part of a Blockchain course, the project simulates a Meta Centra-Land environment where users can purchase, play and manage virtual spaces in exchange for bitcoin.

## requirements
You need to open 2 terminals, 1 to the frontend and the other to the backend.
In addition, you have to install ganache on your machine.

## npm install
The repository contains both frontend and Backend.
Run `npm install`  twice to install all the dependencies:
1. In the "client" folder.
2. In the "truffle" folder.

## How to run this project?
1. Run ganache program.
2. Enter the "client" folder, and then run `npm start`. The frontend site will start an available port. The website should open automatically, if not, open the browser at [http://localhost:3000](http://localhost:3000) (change the port if needed).
3. You need to compile the contract, run `truffle compile` and then `truffle migrate --reset`.

**The first account in ganache will be the owner of the contracts and lands, it must be entered into metaMask.**

## Create lands
You must click on the ADMIN button on the main screen and confirm all 2500 messages (the land is 50*50) for transactions that will appear (I wrote a script in Python that clicks the confirmation 2500 times because it takes a long time).
There is a limit in the contract for the territories to create only 2500, it is impossible to create beyond that.
