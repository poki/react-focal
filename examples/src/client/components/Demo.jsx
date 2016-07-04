import Focal from '../../../..';
import React from 'react';

export default class Demo extends React.Component {
	constructor() {
		super();

		this.state = {
			x: 50,
			y: 50,
			preview: null,
		};

		this.setCoords = this.setCoords.bind(this);
		this.setPreview = this.setPreview.bind(this);
	}

	setCoords(x, y) {
		this.setState({ x, y });
	}

	setPreview(preview) {
		this.setState({ preview });
	}

	render() {
		const photoStyle = {
			backgroundImage: 'url(https://unsplash.it/640/480/?image=1062)',
		};

		const crops = [
			{
				value: null,
				label: 'none',
			},
			{
				value: '16:9',
				label: '1920 × 1080',
			},
			{
				value: '375:667',
				label: '375 × 667',
			},
		];

		return (
			<div className="demo">
				<h1>Focal demo</h1>
				<figure className="demo__photo" style={photoStyle}>
					<Focal
						width={640}
						height={480}
						preview={this.state.preview}
						onChange={this.setCoords}
					/>
				</figure>

				<footer className="demo__footer">
					<div className="demo__crops">
						<p>Set crop preview:</p>
						{crops.map((crop, index) => {
							const cropClasses = ['demo__crop'];

							if (this.state.preview === crop.value) {
								cropClasses.push('is-active');
							}

							return (
								<button
									key={index}
									type="button"
									className={cropClasses.join(' ')}
									onClick={() => this.setPreview(crop.value)}
								>{crop.label}</button>
							);
						})}
					</div>
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
