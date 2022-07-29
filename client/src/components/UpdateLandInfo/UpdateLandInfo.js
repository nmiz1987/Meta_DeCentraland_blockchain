import "./UpdateLandInfo.css";
import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import getWeb3Load from "../../getWeb3Load.js";
import CryptoLand from "../../contracts/CryptoLand.json";
import UserContext from "../../contexts/UserContext";
import ContractContext from "../../contexts/ContractContext";

const UpdateLand = () => {
	const params = useParams();
	const [id] = useState(params.id);
	const [landFromDB, setLandFromDB] = useState({});
	const [message, setMessage] = useState("");
	const [forSale, setForSale] = useState("");
	const [newPrice, setNewPrice] = useState("");
	const [newGame, setNewGame] = useState("");
	const [accountInfo, setAccountInfo] = useContext(UserContext);
	const [contractInfo, setContractInfo] = useContext(ContractContext);

	// for when the user refresh (F5) the page
	useEffect(() => {
		reloadInfo();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const reloadInfo = async () => {
		setAccountInfo(localStorage.getItem("current-user"));
		const web3 = await getWeb3Load();
		const contract = await loadWeb3Contract(web3);
		setContractInfo(contract);
		let land = await contract.methods.landsInArr(id).call();
		setLandFromDB(land);
		setNewPrice(land.price);
		setNewGame("");
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

	async function updateLand() {
		if (forSale.length === 0) {
			setMessage("You must choose if the land is for sale!");
			return;
		}
		if (Number(newPrice) < 0) {
			setMessage("The price must be between greater than 0!");
			return;
		}
		if (isNaN(Number(newPrice))) {
			setNewPrice(landFromDB.price);
		}

		setMessage("");
		try {
			const tmp = {
				forSale: forSale,
				game: newGame,
				price: newPrice,
			};
			await contractInfo.methods
				.updateLand(id, tmp.price, tmp.game, tmp.forSale)
				.send({ from: accountInfo }, (error) => {
					if (!error) {
						console.log("land updated with this information:", tmp);
					}
				});
			setMessage(
				"Land info updated successfully 👍, You can go back to the Lands"
			);
		} catch (err) {
			setMessage(err.message);
		}
	}

	if (!localStorage.getItem("current-user")) {
		return <Navigate to="/" />;
	} else
		return (
			<div className="wrapper">
				<div className="title-landInfo">
					<h2>
						<u>Land Information</u>
					</h2>
				</div>
				<Link id="cancel" to={`/land/${id}`}>
					Cancel
				</Link>
				<div className="content">
					<div>
						<u>
							<strong>Owner:</strong>
						</u>{" "}
						{landFromDB.ownerName}
					</div>
					<div>
						<u>
							<strong>type of land:</strong>
						</u>{" "}
						{landFromDB.typeOfLand}
					</div>
					<div>
						<u>
							<strong>Is for sale:</strong>
						</u>{" "}
						<select id="forSale" onChange={(e) => setForSale(e.target.value)}>
							<option />
							<option id="true">Yes</option>
							<option key="false">No</option>
						</select>
					</div>
					<div>
						<u>
							<strong>Land price:</strong>
						</u>{" "}
						<input
							type="number"
							placeholder="price"
							id="price"
							defaultValue={landFromDB.price}
							min="15"
							max="200"
							onChange={(e) => setNewPrice(e.target.value)}
						/>
						$
					</div>
					<div>
						<u>
							<strong>Link to a game:</strong>
						</u>{" "}
						(previous url - {landFromDB.game})
						<input
							placeholder="Game URL"
							id="game"
							onChange={(e) => setNewGame(e.target.value)}
						/>
					</div>
				</div>
				<div className="bottom">
					<button onClick={updateLand}>Update</button>
					<p className="message">{message}</p>
				</div>
			</div>
		);
};

export default UpdateLand;
