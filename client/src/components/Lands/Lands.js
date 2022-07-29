import "./Land.css";
import { useEffect, useState } from "react";
import OneLand from "../OneLand/OneLand";
import { Navigate } from "react-router-dom";
import Map from "../Map/Map";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import ContractContext from "../../contexts/ContractContext";
import getWeb3Load from "../../getWeb3Load.js";
import CryptoLand from "../../contracts/CryptoLand.json";

const Lands = () => {
	const [lands, setLands] = useState([]);
	const [accountInfo, setAccountInfo] = useContext(UserContext);
	const [contractInfo, setContractInfo] = useContext(ContractContext);
	const [startLoadLand, setStartLoadLand] = useState(false);

	// for when the user refresh (F5) the page
	useEffect(() => {
		setAccountInfo(localStorage.getItem("current-user"));
		reloadInfo();
		setStartLoadLand(true);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// for when the user refresh (F5) the page
	useEffect(() => {
		// due to delay in react i add condition
		if (startLoadLand) {
			loadNFTs(contractInfo);
		}
	}, [contractInfo]); // eslint-disable-line react-hooks/exhaustive-deps

	const reloadInfo = async () => {
		const web3 = await getWeb3Load();
		const contract = await loadWeb3Contract(web3);
		setContractInfo(contract);
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

	const loadNFTs = async (contract) => {
		try {
			const totalSupply = await contract.methods.totalSupply().call(); // call = get
			let nfts = [];
			for (let i = 0; i < totalSupply; i++) {
				let land = await contract.methods.landsInArr(i).call();
				nfts.push(land);
			}
			setLands(nfts);
		} catch (err) {
			console.error(err);
		}
	};

	if (!localStorage.getItem("current-user")) {
		return <Navigate to="/" />;
	} else
		return (
			<div className="allLand">
				<Map />
				{!lands.length ? (
					<h1>Please wait, loading data...</h1>
				) : (
					lands.map((land, index) => (
						<OneLand key={index} info={land} index={index} />
					))
				)}
			</div>
		);
};

export default Lands;
