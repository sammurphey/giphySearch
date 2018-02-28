import React, { Component } from "react";
import LogoIcon from "../img/logo.svg";
import Search from "./Search";

class Logo extends Component {
	constructor () {
		super();
		this.clickHandler = this.clickHandler.bind(this);
	}
	clickHandler () {
		//resets search-state / goes to homepage
		this.props.searchHandler(false, false);
	}
	render () {
		//using onMouseDown instead of onClick to ensure it fires before searchBox's blur event
		return (
			<button id="logo_btn" className="header_btns anim" type="button" onMouseDown={this.clickHandler}>
				<img id="logo_icon" src={LogoIcon} alt="Giphy" title="Home" />
			</button>
		);
	}
}

class Header extends Component {
	render () {
		return (
			<header id="header">
				<Logo searchHandler={this.props.searchHandler}/>
				<Search isSearching={this.props.isSearching} searchHandler={this.props.searchHandler} query={this.props.query} />
			</header>
		);
	}
}

export default Header;
