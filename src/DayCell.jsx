import React, { Component } from 'react';
import './DayCell.css';

// Component
import Modal from './Modal';
import PopupAdd from './PopupAdd';
import PopupEdit from './PopupEdit';

// Date calculator
import cal from './script/dateCalculator.js';

class DayCell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentEvent: null,
			isPopupAddOpen: false,
			isPopupEditOpen: false,
		}

		this.togglePopupAdd = this.togglePopupAdd.bind(this);
		this.togglePopupEdit = this.togglePopupEdit.bind(this);
		this.openEdit = this.openEdit.bind(this);
	}

	togglePopupAdd() {
		this.setState( prevState => ({
			isPopupAddOpen: !prevState.isPopupAddOpen,
			isPopupEditOpen: false
		}));
	}

	togglePopupEdit() {
		this.setState( prevState => ({
			isPopupAddOpen: false,
			isPopupEditOpen: !prevState.isPopupEditOpen 
		}));
	}

	openEdit(event, evt) {
		this.setState( prevState => ({
			currentEvent: event,
		}));
		this.togglePopupEdit();
	}

	generateDayContent() {
		const { day, events, currentUser, openLogin } = this.props;

		let dayContent = []; 

		dayContent.push(
			<div className="day-num" onClick={ currentUser.id ? this.togglePopupAdd : openLogin } key="num">
				{ day }
			</div>
		);

		dayContent = [...dayContent, ...events.map( ( event, index ) => {
			return (
				<div className={ `event-bar event-${ event.visibility }` } onClick={ this.openEdit.bind(this, event) } key={ index } >
					{ event.title }
				</div>
			);
		})];

		return dayContent;
	}

	render() {
		const { day, currentDate, currentUser, ymd, updateEvents } = this.props;
		const { currentEvent } = this.state;

		let dayContent = [];
		let classList = 'day-cell ';
		let dataYmd = `${ ymd[0] }-${ ymd[1] }-${ ymd[2] }`

		if ( day <= 0 || day > cal.monthDays(currentDate) ) {
			classList += 'cell-disabled ';
		}
		else {
			if ( cal.isToday(day, currentDate) ) {
				classList += 'cell-today';
			}

			dayContent = this.generateDayContent();
		}

		return (
			<div className={ classList } data-ymd={ dataYmd } >
				{ dayContent }
				<Modal>
	      			{ this.state.isPopupAddOpen ? <PopupAdd date={ ymd }  currentUser={ currentUser } updateEvents={ updateEvents } closePopup={ this.togglePopupAdd } /> : null }
	      			{ this.state.isPopupEditOpen ? <PopupEdit currentUser={ currentUser } event={ currentEvent } updateEvents={ updateEvents } closePopup={ this.togglePopupEdit } /> : null }
	      		</Modal>
			</div>
		);
	}
}

export default DayCell;