import "./LandInfo.css";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import getWeb3Load from "../../getWeb3Load.js";
import CryptoLand from "../../contracts/CryptoLand.json";
import UserContext from "../../contexts/UserContext";
// import ContractContext from "../../contexts/ContractContext";

const LandInfo = () => {
	const params = useParams();
	const [landFromDB, setLandFromDB] = useState({});
	const [id] = useState(params.id);
	const [accountInfo, setAccountInfo] = useContext(UserContext);
	// const [contractInfo, setContractInfo] = useContext(ContractContext);

	// for when the user refresh (F5) the page
	useEffect(() => {
		reloadInfo();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const reloadInfo = async () => {
		setAccountInfo(localStorage.getItem("current-user"));
		const web3 = await getWeb3Load();
		const contract = await loadWeb3Contract(web3);
		// setContractInfo(contract);
		let land = await contract.methods.landsInArr(id).call();
		setLandFromDB(land);
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
				<div className="edit-info">
					{localStorage.getItem("current-user") === landFromDB.ownerID &&
						landFromDB.typeOfLand === "Real Estate" && (
							<Link land={landFromDB} id="edit-land" to={`/updateLand/${id}`}>
								edit land
							</Link>
						)}
				</div>
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
					{landFromDB.typeOfLand === "Real Estate" && (
						<div>
							<u>
								<strong>Is for sale:</strong>
							</u>{" "}
							{landFromDB.forSale === true ? "Yes!" : "No 😒"}
						</div>
					)}
					{landFromDB.typeOfLand === "Real Estate" &&
						landFromDB.forSale === true && (
							<div className="buy-land">
								<u>
									<strong>Land price:</strong>
								</u>{" "}
								{landFromDB.price} $
								{accountInfo !== landFromDB.ownerID && accountInfo !== "guest" && (
									<div className="link-buy-land">
										<br />
										<br />
										<Link id="buy-land" to={`/buy-land/${id}`}>
											Buy This Land
										</Link>
									</div>
								)}
							</div>
						)}
				</div>

				{landFromDB.typeOfLand === "Real Estate" && (
					<iframe
						id="game-window"
						title="game-window"
						src={landFromDB.game}
						width="1000px"
						height="500px"
					></iframe>
				)}
			</div>
		);
};

export default LandInfo;
