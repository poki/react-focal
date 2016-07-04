import React from 'react';

function clamp(val, min, max) {
	return val < min ? min : val > max ? max : val;
}

export default class Focal extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		preview: React.PropTypes.string,
		x: React.PropTypes.number,
		y: React.PropTypes.number,
	};

	static defaultProps = {
		x: 50,
		y: 50,
	};

	constructor({ width, height, x, y }) {
		super();

		this.state = {
			dragging: false,
			pointX: width / 100 * x,
			pointY: height / 100 * y,
			previewWidth: 0,
			previewHeight: 0,
		};

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
	}

	componentWillMount() {
		if (this.props.preview) {
			this.setPreview(this.props.preview);
		}
	}

	componentWillReceiveProps({ preview }) {
		if (preview && preview !== this.props.preview) {
			this.setPreview(preview);
		}
	}

	onMouseDown(ev) {
		ev.preventDefault();

		this.startPoint = { x: this.state.pointX, y: this.state.pointY };
		this.startPos = { x: ev.pageX, y: ev.pageY };

		this.setState({ dragging: true });

		document.body.addEventListener('mousemove', this.onMouseMove);
		document.body.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseMove(ev) {
		const pos = { x: ev.pageX, y: ev.pageY };
		const dX = this.startPos.x - pos.x;
		const dY = this.startPos.y - pos.y;

		this.prevPos = pos;
		this.setPosition(this.startPoint.x - dX, this.startPoint.y - dY);
	}

	onMouseUp() {
		this.setState({ dragging: false });

		document.body.removeEventListener('mousemove', this.onMouseMove);
		document.body.removeEventListener('mouseup', this.onMouseUp);
	}

	setPosition(x, y) {
		const clampedX = clamp(x, 0, this.props.width);
		const clampedY = clamp(y, 0, this.props.height);

		if (clampedX === this.state.pointX && clampedY === this.state.pointY) return;

		this.setState({
			pointX: clampedX,
			pointY: clampedY,
		});

		if (this.props.onChange) {
			this.props.onChange(
				Math.round(100 / this.props.width * clampedX),
				Math.round(100 / this.props.height * clampedY),
			);
		}
	}

	setPreview(preview) {
		const s = preview.split(':');

		let width = parseInt(s[0], 10);
		let height = parseInt(s[1], 10);

		let ratio;
		if (width < this.props.width && height < this.props.height) {
			ratio = this.props.width / width;
			width *= ratio;
			height *= ratio;
		}

		if (width > this.props.width) {
			ratio = this.props.width / width;
			width *= ratio;
			height *= ratio;
		}

		if (height > this.props.height) {
			ratio = this.props.height / height;
			width *= ratio;
			height *= ratio;
		}

		width = Math.round(width);
		height = Math.round(height);

		this.setState({
			previewWidth: width,
			previewHeight: height,
		});
	}

	renderOverlays() {
		const { pointX, pointY, previewWidth: width, previewHeight: height } = this.state;

		const x = clamp(pointX - (width / 2), 0, this.props.width - width);
		const y = clamp(pointY - (height / 2), 0, this.props.height - height);

		const previewStyle = { width, height, transform: `translate(${x}px, ${y}px)` };
		let overlay1Style;
		let overlay2Style;

		if (width === this.props.width) {
			overlay1Style = { transform: `translate(0, ${y - this.props.height}px)` };
			overlay2Style = { transform: `translate(0, ${y + height}px)` };
		} else {
			overlay1Style = { transform: `translate(${x - this.props.width}px, 0)` };
			overlay2Style = { transform: `translate(${x + width}px, 0)` };
		}

		return [
			<div key={0} className="focal__preview" style={previewStyle} />,
			<div key={1} className="focal__overlay" style={overlay1Style} />,
			<div key={2} className="focal__overlay" style={overlay2Style} />,
		];
	}

	render() {
		const { width, height, preview } = this.props;
		const { pointX, pointY } = this.state;

		const classes = ['focal'];
		const styles = { width, height };
		const pointStyles = { transform: `translate(${pointX}px, ${pointY}px)` };

		if (this.state.dragging) {
			classes.push('focal--dragging');
		}

		return (
			<article className={classes.join(' ')} style={styles}>
				<div
					className="focal__point"
					onMouseDown={this.onMouseDown}
					style={pointStyles}
				/>
				{preview ? this.renderOverlays() : ''}
			</article>
		);
	}
}
