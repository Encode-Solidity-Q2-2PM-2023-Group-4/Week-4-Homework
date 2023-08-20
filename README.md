# Week-4-Homework

Repo for Nanda Girish, Antony Siahaan, Adam Czopp and Linus Kelsey to complete the fourth week of homework for the Encode Club's Solidity bootcamp. This week we have been tasked with creating a voting dApp to perform the same functionality as last week's homework, in which we deployed a tokenised ballot. This time around we need to create the front and backend, connected through APIs, with which our votes can be delegated, placed and recorded to the blockchain (or off-chain).

### Token and Ballot Deployment

New Tokens and Ballots were deployed to the blockchain as in last week's homework:

<img width="699" alt="Screenshot 2023-08-20 at 22 47 44" src="https://github.com/Encode-Solidity-Q2-2PM-2023-Group-4/Week-4-Homework/assets/96599839/4ee470ef-dac3-49b8-ae59-d487543ec852">

TOKEN: [0xcc3...216](https://sepolia.etherscan.io/address/0xcc355cd129ca9be1d3140939928fa33026b60216)

BALLOT: [0x1ac...2c6](https://sepolia.etherscan.io/address/0x1acf75fa3a4705564cd827cda2d2e0ccd0b372c6)

### Frontend Creation

The frontend (in [`index.tsx`](_alchemy-folder/frontend/components/instructionsComponent/index.tsx)) was created building on the default project, using the buttons created by the Alchemy SDK:

<img width="721" alt="Screenshot 2023-08-20 at 22 48 59" src="https://github.com/Encode-Solidity-Q2-2PM-2023-Group-4/Week-4-Homework/assets/96599839/cc745543-6ba6-404f-8c70-0822f705d5c2">

While we didn't have enough time to make this a polished browser, we implemented all of the required functionality, in the backend and wih APIs.

### Backend Creation

The backend was created using nest, and the app calls are written in [`app.service.ts`](_nest-backend/src/app.service.ts) and [`app.controller.ts`](_nest-backend/src/app.controller.ts).

### Integration

We connected the front to the backend by using API calls such as this one:

![Screenshot 2023-08-20 at 22 55 13](https://github.com/Encode-Solidity-Q2-2PM-2023-Group-4/Week-4-Homework/assets/96599839/2432238b-9b9a-4be2-9ecf-f844148c7c14)

### Delegation and Voting

Delegation and voting was implemented similarly to the previous week, and again we had a small issue with delegating via a different ballot contract to the voting contract. However, this still allowed us to delegate our votes - as seen above in the frontend section, under voting power - and we were able to cast votes just as easily.

DELEGATION: [0x9a1...7aa](https://sepolia.etherscan.io/tx/0x9a1f7bb8da6a9accf6a367d035e896c917e225a85ddd9610891d6186db64c7aa)

VOTING: [0xa6a...46b](https://sepolia.etherscan.io/tx/0xa6ad0acd2d7ba0b76bc72f0c63bba02e75de0d8c406fbeac6498a4afed72046b)
