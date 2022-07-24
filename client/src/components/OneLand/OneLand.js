import "./OneLand.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const OneLand = ({ index, info }) => {
	const { ownerID, typeOfLand, forSale } = info;
	const [color, setColor] = useState("");

	const chooseColor = (typeOfLand) => {
		let tmp;
		if (localStorage.getItem("current-user") === "guest") {
			if (typeOfLand === "Park") tmp = "green";
			else if (typeOfLand === "Road") tmp = "rgb(59, 59, 59)";
			else if (info.game === "") tmp = "#6495ED";
			else if (info.game.length > 0) tmp = "#FF7F50";
		} else if (
			ownerID === localStorage.getItem("current-user") &&
			typeOfLand === "Real Estate"
		)
			tmp = "red";
		else if (typeOfLand === "Park") tmp = "green";
		else if (typeOfLand === "Road") tmp = "rgb(59, 59, 59)";
		else if (typeOfLand === "Real Estate" && forSale === true) tmp = "#993bff";
		else if (typeOfLand === "Real Estate" && forSale === false) tmp = "yellow";
		setColor(tmp);
	};

	useEffect(() => {
		chooseColor(typeOfLand);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Link to={`/land/${index}`} land={info}>
			<span className="OneLand">
				<div className="item" style={{ backgroundColor: color }}></div>
			</span>
		</Link>
	);
};

export default OneLand;
