import React, { Component } from "react";
import Header from "./js/Header";
import Main from "./js/Main";

class App extends Component {
	constructor() {
		super();
		this.state = {
			isSearching: false,//shows/hides searchBox element
			view: "trending",//api endpoint
			query: ""//search term
		}
		this.searchHandler = this.searchHandler.bind(this);
	}
	searchHandler(bool, value) {
		//toggle searchBox visibility and update api endpoints
		if (value.length) {
			this.setState({
				isSearching: bool,
				view: "search",
				query: value
			});
		} else {
			this.setState({
				isSearching: bool,
				view: "trending",
				query: ""
			})
		}
	}
	render () {
		return (
			<div id="app">
				<Header isSearching={this.state.isSearching} searchHandler={this.searchHandler} query={this.state.query}/>
				<Main view={this.state.view} query={this.state.query}/>
			</div>
		);
	}
}

export default App;
