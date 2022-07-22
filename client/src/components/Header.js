import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
// import getWeb3 from "../getWeb3.js";

const Header = () => {
	const [accountInfo, setAccountInfo] = useContext(UserContext);

	const name = "Final Project - Meta DeCentraland";
	const author = "Netanel Mizrahi";

	useEffect(() => {
		setAccountInfo(localStorage.getItem("current-user"));
	}, []);

	return (
		<div className="header">
			<ul className="header-links">
				<div></div>
				{localStorage.getItem("current-user") && (
					<li>Hello {localStorage.getItem("current-user")}</li>
				)}
				<li>
					{localStorage.getItem("current-user") ? (
						<Link to="/land">🏠</Link>
					) : (
						<Link to="/">🏠</Link>
					)}

					{localStorage.getItem("current-user") && (
						<Link to="/sing-up" id="sing-out">
							Sing-Out
						</Link>
					)}
				</li>
			</ul>
			<h1 className="title">{name}</h1>
			<h1 className="creator">Created By: {author}</h1>
		</div>
	);
};

export default Header;
