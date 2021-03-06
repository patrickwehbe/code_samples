import React, { useState } from "react";
import "./Search.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

// DATE PICKER COMPONENT
function Search() {
	const history = useHistory();
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());

	const selectionRange = {
		startDate: startDate,
		endDate: endDate,
		key: "selection",
	};

	function handleSelect(ranges) {
		setStartDate(ranges.selection.startDate);
		setEndDate(ranges.selection.endDate);
	}

	return (
		<div className="search">
			<DateRangePicker
				ranges={[selectionRange]}
				onChange={handleSelect}
			/>

			<Button onClick={() => history.push("/search")}>Book</Button>
		</div>
	);
}

export default Search;
