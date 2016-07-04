import Focal from '../../../..';
import React from 'react';

export default class Demo extends React.Component {
	constructor() {
		super();

		this.state = {
			x: 50,
			y: 50,
		};

		this.setCoords = this.setCoords.bind(this);
	}

	setCoords(x, y) {
		this.setState({ x, y });
	}

	render() {
		const photoStyle = {
			backgroundImage: 'url(https://unsplash.it/640/480/?image=1062)',
		};

		return (
			<div className="demo">
				<h1>Focal demo</h1>
				<figure className="demo__photo" style={photoStyle}>
					<Focal
						width={640}
						height={480}
						onChange={this.setCoords}
					/>
				</figure>

				<footer className="demo__footer">
					<div className="demo__coords">
						<span>{this.state.x}</span>
						&times;
						<span>{this.state.y}</span>
					</div>
				</footer>
			</div>
		);
	}
}
