import React from "react";
import {Link} from "react-router-dom";
import {loadAsset} from "../../../../../utils/Helpers";
import MegaBlock from "./MegaBlock";


const MegaMenuItem = (props) => {
	const {categories, parent} = props;

	const allChildren1 = categories?.filter(filter => filter.ParentId === parent.otc_id) || [];


	return (
		<li className="megamenu-container">
			<Link className="sf-with-ul" to={`/${parent.slug}`}>
				{
					parent.icon ?
						<img src={loadAsset(parent.icon)}
						     style={{width: "20px", display: "inline", marginRight: "1rem"}}
						     alt={parent.name}/>
						:
						<i className="icon-laptop"/>
				}
				{parent.name}
			</Link>

			{allChildren1?.length > 0 && <MegaBlock categories={categories} allChildren1={allChildren1} parent={parent}/>}

		</li>
	);
};

export default MegaMenuItem;
