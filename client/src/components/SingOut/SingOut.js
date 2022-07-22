import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

import "./SingOut.css";

const SingOut = () => {
	const [redirect, setRedirect] = useState(false);
	const [currentUser, setCurrentUser] = useContext(UserContext);

	useEffect(() => {
		localStorage.removeItem("current-user");
		setCurrentUser("");
		setTimeout(() => setRedirect(true), 1000);
	}, []);

	if (!localStorage.getItem("current-user") && redirect === true) {
		return <Navigate to="/" />;
	} else {
		return <p>Singing out, Please wait...</p>;
	}
};

export default SingOut;
