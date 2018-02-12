import React from 'react';
import PT from 'prop-types';

function clamp(val, min, max) {
	return val < min ? min : val > max ? max : val;
}

export default class Focal extends React.Component {
	static propTypes = {
		onChange: PT.func,
		height: PT.number.isRequired,
		width: PT.number.isRequired,
		preview: PT.string,
		x: PT.number,
		y: PT.number,
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

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragMove = this.onDragMove.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
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

	onDragStart(ev) {
		ev.preventDefault();

		this.startPoint = { x: this.state.pointX, y: this.state.pointY };
		this.startPos = this.getPointer(ev);

		this.setState({ dragging: true });

		window.addEventListener('mousemove', this.onDragMove);
		window.addEventListener('touchmove', this.onDragMove);
		window.addEventListener('mouseup', this.onDragEnd);
		window.addEventListener('touchend', this.onDragEnd);
	}

	onDragMove(ev) {
		const pos = this.getPointer(ev);
		const dX = this.startPos.x - pos.x;
		const dY = this.startPos.y - pos.y;

		this.prevPos = pos;
		this.setPosition(this.startPoint.x - dX, this.startPoint.y - dY);
	}

	onDragEnd() {
		this.setState({ dragging: false });

		window.removeEventListener('mousemove', this.onDragMove);
		window.removeEventListener('touchmove', this.onDragMove);
		window.removeEventListener('mouseup', this.onDragEnd);
		window.removeEventListener('touchend', this.onDragEnd);
	}

	getPointer(ev) {
		if (ev.touches || ev.changedTouches) {
			const t = ev.touches[0] || ev.changedTouches[0];
			return { x: t.pageX, y: t.pageY };
		}

		return { x: ev.pageX, y: ev.pageY };
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
					onMouseDown={this.onDragStart}
					onTouchStart={this.onDragStart}
					style={pointStyles}
				/>
				{preview ? this.renderOverlays() : ''}
			</article>
		);
	}
}
