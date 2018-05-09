import { Component } from 'react';
import ReactDOM from 'react-dom';

const modalRoot = document.getElementById('modal-root');

class Modal extends Component {
	constructor(props) {
		super(props);
		this.modal = document.createElement('div');
	}

	componentDidMount() {
		modalRoot.appendChild(this.modal);
	}

	componentWillUnmount() {
		modalRoot.removeChild(this.modal);
	}

	render() {
		return ReactDOM.createPortal(
			this.props.children,
			this.modal,
		);
	}
}

export default Modal;