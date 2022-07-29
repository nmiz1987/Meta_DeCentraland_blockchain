import "./BuyLand.css";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, Navigate } from "react-router-dom";
import UserContext from "../../contexts/UserContext";
import ContractContext from "../../contexts/ContractContext";
import getWeb3Load from "../../getWeb3Load.js";
import CryptoLand from "../../contracts/CryptoLand.json";

const LandInfo = (land) => {
	const params = useParams();
	const [landFromDB, setLandFromDB] = useState({});
	const [landId] = useState(params.id);
	const [message, setMessage] = useState("");
	const [hideButtons, setHideButtons] = useState(false);
	const [ownerName, setOwnerName] = useState("");
	const [accountInfo, setAccountInfo] = useContext(UserContext);
	const [balance, setBalance] = useState("");
	const [contractInfo, setContractInfo] = useContext(ContractContext);

	// for when the user refresh (F5) the page
	useEffect(() => {
		reloadInfo();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const reloadInfo = async () => {
		const web3 = await getWeb3Load();
		const account = await loadWeb3Account(web3);
		const balance = await loadWeb3Balance(web3, account);
		const contract = await loadWeb3Contract(web3);
		setAccountInfo(account);
		setBalance(balance);
		setContractInfo(contract);
		let land = await contract.methods.landsInArr(landId).call();
		setLandFromDB(land);
	};

	const loadWeb3Account = async (web3) => {
		const accounts = await web3.eth.getAccounts();
		if (accounts) {
			setAccountInfo(accounts[0]);
			localStorage.setItem("current-user", accounts[0]);
		}
		return accounts[0];
	};

	const loadWeb3Balance = async (web3, account) => {
		const balance = await web3.eth.getBalance(account);
		return balance / 1e18;
	};

	const loadWeb3Contract = async (web3) => {
		const networkId = await web3.eth.net.getId();
		const networkData = CryptoLand.networks[networkId];
		if (networkData) {
			const abi = CryptoLand.abi;
			const address = networkData.address;
			const contract = new web3.eth.Contract(abi, address);
			return contract;
		}
	};

	async function buyLand() {
		// some extra validation
		if (landFromDB.typeOfLand !== "Real Estate") {
			setMessage("This Land is not Real Estate");
			return;
		}
		if (landFromDB.forSale !== true) {
			setMessage("This Land is not for sale");
			return;
		}

		try {
			await contractInfo.methods
				.buyLand(landId, ownerName)
				.send(
					{ from: accountInfo, value: landFromDB.price * 1e18 },
					(error) => {
						if (!error) {
							console.log("Congratulations on the purchase of the land ");
						}
					}
				);
			setMessage("Congratulations on the purchase of the land 👍");
		} catch (err) {
			setMessage(err.message);
		}
	}

	if (!localStorage.getItem("current-user")) {
		return <Navigate to="/" />;
	} else
		return (
			<div className="wrapper">
				<div className="title-BuyLand">
					<h2>
						<u>Buy This Land</u>
					</h2>
				</div>
				<div className="content">
					<div>
						<u>
							<strong>This land costs:</strong>
						</u>{" "}
						{landFromDB.price} Ether
					</div>
					<div>
						<u>
							<strong>You have in your account:</strong>
						</u>{" "}
						{balance} Ether
					</div>
					{!localStorage.getItem("BuyLand") &&
						(landFromDB.ownerID !== accountInfo ? (
							balance >= landFromDB.price ? (
								<div className="user-have-money">
									<u>
										<strong>New Owner Name:</strong>
									</u>{" "}
									<input
										placeholder="Owner's name"
										id="ownerName"
										onChange={(e) => setOwnerName(e.target.value)}
									/>
									<strong>
										<h3>Are you sure you want to buy this land?</h3>
									</strong>
									<div className="link-buy-land">
										<div className="buy-yes" onClick={buyLand}>
											YES! 👌
										</div>
										<Link className="buy-no" to={`/land`}>
											No 😒
										</Link>
									</div>
								</div>
							) : (
								<div className="user-cant-buy-land">
									<h3>Sorry, can't buy this land.</h3>
								</div>
							)
						) : (
							<div></div>
						))}
				</div>
				<div className="bottom">
					<p className="message">{message}</p>
				</div>
			</div>
		);
};

export default LandInfo;
