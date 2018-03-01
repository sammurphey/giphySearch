import React, { Component } from 'react';
import MasonryLayout from 'react-masonry-layout';

class Images extends Component {//gallery object
	constructor(props) {
		super(props);
		this.state = {
			pics: [],//returned json
			view: this.props.view,//endpoint
			query: this.props.query//search term
		}
	}
	componentDidMount() {
		//hit the api right away to get the trending images
		this.getImages(this.props.view, this.props.query);
	}
	componentWillReceiveProps(nextProps) {
		//empty the data array, this forces masonryLayout to reflow
		this.setState({pics: []});
		//then, get the new images
		this.getImages(nextProps.view, nextProps.query);
	}
	componentWillUnmount() {
		clearTimeout(this.refreshTimer);
	}
	getImages(v, q) {
		//basic fetch wrapper, updates state when complete
		var url = "https://api.giphy.com/v1/gifs/" + v + "?api_key=9ZZKGqLGYlfsnUW7BrYfij8vsbvudozF&limit=50";
		if (q.length) {
			url += "&q=" + encodeURIComponent(q);
		}
		fetch(url)
		.then(results => {
			return results.json();

		}).then(data => {
			this.setState({pics: data.data});
		})
	}
	render() {
		//masonryLayout's media queries
		const sizes = [{
			columns: 1,
			gutter: 10
		}, {
			mq: "430",
			colums: 2,
			gutter: 10
		}, {
			mq: "640px",
			columns: 3,
			gutter: 10
		}, {
			mq: "850px",
			columns: 4,
			gutter: 10
		}, {
			mq: "1060px",
			columns: 5,
			gutter: 10
		}, {
			mq: "1270px",
			columns: 6,
			gutter: 10
		}]
		return(
			<MasonryLayout id="masonry-layout" onImagesLoaded={this.handleImagesLoaded} className={this.state.visibility} sizes={sizes}>
				{this.state.pics.map((pic) => {
					let dir = pic.images.fixed_width;
					return (
						<div className="image-element-class" key={pic.id} style={{
							height: dir.height + "px",
							width: dir.width + "px"
						}}>
							<a href={pic.url} target="_blank"><img id={pic.id} src={dir.url} alt={pic.title} title={pic.title} /></a>
						</div>
					)}
				)}
			</MasonryLayout>
		);
	}
}

class Main extends Component {
	//just sets the page tite and passes down props
	constructor() {
		super();
		this.state = {
			title: "Trending Gifs"
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.view === "trending") {
			this.setState({title: "Trending Gifs"});
		} else if (nextProps.view === "search") {
			this.setState({title: "Search: " + nextProps.query})
		}
	}
	render() {
		return(
			<main id="main">
				<h1>{this.state.title}</h1>
				<Images view={this.props.view} query={this.props.query}/>
			</main>
		);
	}
}

export default Main;
