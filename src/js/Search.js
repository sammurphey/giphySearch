import React, { Component } from "react";
import CacheIcon from "../img/cache.svg";
import SearchIcon from "../img/search.svg";
import SearchIconActive from "../img/search_active.svg";

class SearchBtn extends Component {
	//magnifying glass icon
	render () {
		return (
			<button className="anim header_btns search_btn" type="button" onClick={this.props.cb}>
				<img className="search_icon" src={this.props.icon} alt="Search" title="Search" />
			</button>
		);
	}
}

class SearchCache extends Component {
	//the cache dropdown
	constructor () {
		super();
		this.clickHandler = this.clickHandler.bind(this);
	}
	clickHandler (e) {//rerun selected search
		e.stopPropagation();
		var val = e.target.value;
		document.getElementById("search_box_input").blur();
		this.props.searchHandler(false, val);

	}
	render () {
		//set props to new var so we can safely reverse it
		var searchTerms = this.props.cacheData;
		return (
			<div id="cache" className="anim">
				{searchTerms && <ul id="searches">
					{searchTerms.reverse().map((searchTerm) => {
						return(
							<li key={encodeURIComponent(searchTerm)} className="search_term">
								<button value={encodeURIComponent(searchTerm)} type="button" onMouseDown={this.clickHandler}>
									<img className="cache_icon" src={CacheIcon} alt="Cached search" />
									<span>{searchTerm}</span>
								</button>
							</li>
						)}
					)}
				</ul>}
			</div>
		);
	}
}

class SearchBox extends Component {
	//textbox element, also contains cache ref
	constructor () {
		super();
		this.state = {
			cacheData: [],//past searches
			value: "",//the current search term
			visibility: ""
		};
		this.addToCache = this.addToCache.bind(this);
		this.blurHandler = this.blurHandler.bind(this);
		this.changeHandler = this.changeHandler.bind(this);
	}
	componentDidMount () {
		//retrieve cache from local and set state
		var data = JSON.parse(localStorage.getItem("pastSearches")), newData = [], i;
		if (data) {
			for (i = 0; i < data.length; i += 1) {
				if (data[i] !== "") {
					newData.push(data[i])
				}
			}
		} else {
			newData.push("")
		}
		this.setState({cacheData: newData});
	}
	componentWillReceiveProps (nextProps) {
		//clear any remaining timeouts from last props change
		clearTimeout(this.showHideTimer);
		if (nextProps.isSearching) {
			//make isSearching bool into a usable classname
			this.setState({visibility: "visible"});
		} else {
			this.setState({visibility: "hidden"});
			//this timer removes hidden class after the exit animations have completed. this allows us to reset transition-delays and set up the element for the next time its opened.
			this.showHideTimer = setTimeout( (that) => {
				this.setState({visibility: ""});
			}, 900, this);
		}
		if (nextProps.query !== this.state.value) {
			this.setState({value: nextProps.query})
		}
		//if props changed theres a good chance the cache did too
		this.setState({cacheData: JSON.parse(localStorage.getItem("pastSearches"))})
	}
	componentWillUnmount () {//clean exits
		clearTimeout(this.cacheTimer);
		clearTimeout(this.showHideTimer);
	}
	addToCache() {
		//pushes current search term into localStorage cache
		var data, newData = [], i, exists = false;
		//clear the timeout we'll regenerate below
		clearTimeout(this.cacheTimer);
		//loop through existing cache to make sure we dont add duplicates
		if (this.state.value.length) {
			if (this.state.cacheData) {
				data = this.state.cacheData;
				for (i = 0; i < data.length; i += 1) {
					if (data[i] === this.state.value) {
						exists = true;
					}
					if (data[i] !== "") {//if any blanks entries were somehow added, remove them now
						newData.push(data[i])
					}
				}
			}
			//save new, unique term
			if (!exists) {
				newData.push(this.state.value);
			}
			localStorage.setItem("pastSearches", JSON.stringify(newData));
			this.setState({cacheData: newData});
		}
	}
	blurHandler(e) {
		//fires when you're done searching
		var val = e.target.value,
			go = false;
		//dont wait to cache, we'll do it now
		clearTimeout(this.cacheTimer);
		//check what caused the blur, if it was something actionable, make sure it can still fire
		if (!e.relatedTarget) {
			go = true;
		} else if(e.relatedTarget.tagName !== "button") {
			go = true;
		}
		if (go) {
			this.setState({value: val});
			//pass back to App and start the process
			this.props.searchHandler(false, val);
			this.addToCache();
		}
	}
	changeHandler(e) {
		//fires every keystroke in searchBox
		var val = e.target.value
		//dont cache yet, they're still typing
		clearTimeout(this.cacheTimer);
		this.setState({value: val});
		//continuously update main view
		this.props.searchHandler(true, val);
		//set up a timer, if the user stops typing for a while, that phrase was probably complete and should be cached.
		this.cacheTimer = setTimeout(() => this.addToCache(), 10000)
	}
	render () {
		return (
			<div id="search_box" className={"anim " + this.state.visibility}>
				<input id="search_box_input" className="anim" type="text" palceholder="Search"
				onBlur={this.blurHandler} onChange={this.changeHandler} value={this.state.value} />
				<SearchBtn icon={SearchIconActive} onClick={this.blurHandler}/>
				<SearchCache cacheData={this.state.cacheData} searchHandler={this.props.searchHandler} />
			</div>
		)
	}
}

class Search extends Component {
	constructor () {
		super();
		this.state = {
			isSearching: false
		}
		this.startSearching = this.startSearching.bind(this);
		this.stopSearching = this.stopSearching.bind(this);
	}
	componentWillReceiveProps (nextProps) {
		this.setState({isSearching: nextProps.isSearching});
	}
	//toggle searchbox visibility and focus textbox
	startSearching () {
		this.setState({isSearching: true});
		document.getElementById("search_box_input").focus();
	}
	stopSearching () {
		this.setState({isSearching: false});
	}
	render () {
		return (
			<div id="search">
				<SearchBtn cb={this.startSearching} icon={SearchIcon} />
				<SearchBox isSearching={this.state.isSearching} searchHandler={this.props.searchHandler} query={this.props.query} />
			</div>
		)
	}
}

export default Search;
