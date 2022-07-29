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
import CryptoToken from "../../contracts/CryptoToken.json";
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
			await contract.methods.createNewUser().send({ from: add }, (error) => {
				if (!error) {
					console.log("New User Created");
				}
			});
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

	const loadWeb3TokenContract = async (web3) => {
		const networkId = await web3.eth.net.getId();
		const networkData = CryptoToken.networks[networkId];
		if (networkData) {
			const abi = CryptoToken.abi;
			const address = networkData.address;
			localStorage.setItem("new-token-contract", address);
			console.log("new-token-contract", address);

			const contract = new web3.eth.Contract(abi, address);
			return contract;
		}
	};

	const mint = async (landContract, account, web3) => {
		console.log("account", account);
		const totalSupply = await landContract.methods.totalSupply().call(); // call = get
		console.log("totalSupply", totalSupply);
		//there are 10000 lands in the DB
		for (let i = totalSupply; i < 2500; i++) {
			await landContract.methods
				.createOneLand(landsDB[i].type, landsDB[i].forSale, i)
				.send({ from: account }, (error) => {
					if (!error) {
						console.log("Created land number", i);
					}
				});
		}
	};

	const createLand = async () => {
		const web3 = await getWeb3();
		await loadWeb3TokenContract(web3);
		const account = await loadWeb3Account(web3);
		const landContract = await loadWeb3LandContract(web3);
		await mint(landContract, account, web3);
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
								<div onClick={createLand}>ADMIN - Create Token and Land!</div>
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
