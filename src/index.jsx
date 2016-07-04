import React from 'react';

function clamp(val, min, max) {
	return val < min ? min : val > max ? max : val;
}

export default class Focal extends React.Component {
	static propTypes = {
		onChange: React.PropTypes.func,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
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
		};

		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
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

	render() {
		const { width, height } = this.props;
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
			</article>
		);
	}
}
