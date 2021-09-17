import React, { useContext } from "react";
import { GlobalState } from "../../GlobalState";
import { Link } from "react-router-dom";
import "./Shops.css";
import MyCard from "../Card/MyCard";
import { Grid } from "@material-ui/core";
import Loading from "../Utils/Loading";
function Shops() {
	const state = useContext(GlobalState);
	const [shops] = state.shopAPI.shops;
	return (
		<>
			<div className="shops">
				<Grid container spacing={5}>
					{shops.map((shop) => {
						return (
							<Grid item xs={12} sm={6} md={4}>
								<Link
									to={`/shop/${shop.shop_id}`}
									style={{ textDecoration: "none" }}>
									<MyCard
										image={shop.shop_logo}
										title={shop.shop_name}
										description={shop.shop_description}
										rating={shop.shop_rating}
									/>
								</Link>
							</Grid>
						);
					})}
				</Grid>
			</div>
			{shops.lenth === 0 && <Loading />}
		</>
	);
}

export default Shops;
