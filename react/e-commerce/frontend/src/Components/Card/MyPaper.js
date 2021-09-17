import { Paper } from "@material-ui/core";
import React from "react";

function MyPaper({ image, title, description }) {
	return (
		<div>
			<Paper
				id="paper"
				style={{
					minWidth: 300,
					maxWidth: 400,
					maxHeight: 100,
					minHeight: 150,
					position: "relative",
					display: "flex",
					alignItems: "center",
				}}>
				<img
					src={image}
					alt=""
					style={{
						objectFit: "contain",
						maxWidth: 100,
						position: "absolute",
						top: "10%",
						left: "4%",
					}}
				/>
				<div
					className="title"
					style={{
						position: "absolute",
						left: "38%",
						top: "10%",
						fontSize: "14px",
						fontWeight: "bold",
						alignItems: "center",
					}}>
					{title}
				</div>
				<div
					className="description"
					style={{
						position: "absolute",
						left: "38%",
						fontSize: "14px",
					}}>
					{description}
				</div>
			</Paper>
		</div>
	);
}

export default MyPaper;
