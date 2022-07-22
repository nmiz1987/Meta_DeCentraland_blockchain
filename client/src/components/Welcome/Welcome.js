import "./Welcome.css";
import picture from "../../img/pic.png";
import video from "../../video/welcome-video.mp4";
import { useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import ContractContext from "../../contexts/ContractContext";

import getWeb3 from "../../getWeb3.js";
import CryptoLand from "../../contracts/CryptoLand.json";
import CryptoUser from "../../contracts/CryptoUser.json";
const landsDB = require("../../landsDB.json");

const Welcome = () => {
	const [accountInfo, setAccountInfo] = useContext(UserContext);
	const [, setContractInfo] = useContext(ContractContext);

	const vidRef = useRef();

	useEffect(() => {
		localStorage.removeItem("BuyLand");
		localStorage.removeItem("current-user");
		localStorage.removeItem("user-contract-owner");
		localStorage.removeItem("land-contract-owner");
		setAccountInfo({});
		vidRef.current.play();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	async function web3Func() {
		const web3 = await getWeb3();
		await loadWeb3Account(web3);
		await loadWeb3LandContract(web3);
		await loadWeb3UsersContract(web3);
	}

	const loadWeb3UsersContract = async (web3) => {
		let add = await loadWeb3Account(web3);

		const networkId = await web3.eth.net.getId();
		const networkData = CryptoUser.networks[networkId];
		if (networkData) {
			const abi = CryptoUser.abi;
			const address = networkData.address;
			const contract = new web3.eth.Contract(abi, address);

			const owner = await contract.methods.owner().call();
			localStorage.setItem("user-contract-owner", owner);

			// await contract.methods.createNewUser().send({ from: add }, (error) => {
			// 	if (!error) {
			// 		console.log("New User");
			// 	}
			// });
			return contract;
		}
	};

	const loadWeb3Account = async (web3) => {
		const accounts = await web3.eth.getAccounts();
		if (accounts) {
			setAccountInfo(accounts[0]);
			localStorage.setItem("current-user", accounts[0]);
		}
		return accounts[0];
	};

	const enterAsGuest = async () => {
		setAccountInfo("guest");
		localStorage.setItem("current-user", "guest");
	};

	const loadWeb3LandContract = async (web3) => {
		const networkId = await web3.eth.net.getId();
		const networkData = CryptoLand.networks[networkId];
		if (networkData) {
			const abi = CryptoLand.abi;
			const address = networkData.address;
			const contract = new web3.eth.Contract(abi, address);
			const owner = await contract.methods.owner().call();
			localStorage.setItem("land-contract-owner", owner);
			setContractInfo(contract);
			return contract;
		}
	};

	const mint = async (landContract, account) => {
		console.log("account", account);
		for (let i = 0; i < 2; i++) {
			const tmp = {
				type: landsDB[i].type,
				price: landsDB[i].price,
				forSale: landsDB[i].forSale,
			};
			await landContract.methods
				.createOneLand(tmp.type, tmp.price, tmp.forSale)
				.send({ from: account }, (error) => {
					if (!error) {
						console.log("land created", tmp);
					}
				});
		}
	};

	const createLand = async () => {
		const web3 = await getWeb3();
		const account = await loadWeb3Account(web3);
		const landContract = await loadWeb3LandContract(web3);
		await mint(landContract, account);
	};

	if (accountInfo === localStorage.getItem("current-user")) {
		// if use connected to the system
		return <Navigate to="/land" />;
	}
	return (
		<div className="picture">
			<div className="links">
				<ul>
					{accountInfo === "buyer" ? (
						<li>Hello {accountInfo}</li>
					) : accountInfo === "guest" ? (
						<li>Hello Guest!</li>
					) : (
						<>
							<li>
								<div onClick={web3Func}>Enter as buyer</div>
							</li>
							<li>
								<div onClick={enterAsGuest}>Enter as Guest</div>
							</li>
							<li>
								<div onClick={createLand}>Create land!</div>
							</li>
						</>
					)}
				</ul>
			</div>
			<video width="50%" ref={vidRef} controls muted>
				<source src={video} type="video/mp4" />{" "}
			</video>
			<img src={picture} alt="Welcome" width="700" height="400"></img>
		</div>
	);
};

export default Welcome;
