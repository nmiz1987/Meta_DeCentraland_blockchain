import "./Map.css";

const Map = () => {
	return (
		<div id="wrapper">
			<h4>What each color indicates?</h4>
			{localStorage.getItem("current-user") === "guest" ? (
				<>
					<div style={{ backgroundColor: "green" }}>Park</div>
					<div style={{ color: "white", backgroundColor: "rgb(59, 59, 59)" }}>
						Road
					</div>
					<div style={{ backgroundColor: "#FF7F50" }}>There is a game</div>
					<div style={{ backgroundColor: "#6495ED" }}>There isn't a game</div>
				</>
			) : (
				<>
					<div style={{ backgroundColor: "red" }}>Land you own</div>
					<div style={{ backgroundColor: "green" }}>Park</div>
					<div style={{ backgroundColor: "rgb(59, 59, 59)" }}>Road</div>
					<div style={{ backgroundColor: "#993bff" }}>Real Estate for sale</div>
					<div style={{ backgroundColor: "yellow" }}>
						Real Estate not for sale
					</div>
				</>
			)}
		</div>
	);
};

export default Map;
