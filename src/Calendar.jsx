import React, { Component } from 'react';
import './Calendar.css';

// Component
import DayCell from './DayCell';

// Date calculator
import cal from './script/dateCalculator.js';

class Calendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPopupAddOpen: false,
			isPopupEditOpen: false
		}

		this.screenEvents = this.screenEvents.bind(this);
		this.generateGrid = this.generateGrid.bind(this);
	}

	screenEvents(allEvents, currentDate, day) {
		let events = [];

		for (let event of allEvents) {
			if ( cal.withinDate( new Date( currentDate.getFullYear(), currentDate.getMonth(), day ), event.startDate, event.endDate ) ) {
				events.push(event);
			}
		}

		return events; 
	}

	generateGrid() {
		let { currentDate, currentUser, allEvents, openLogin, updateEvents } = this.props;
		let grid = [];

		for (let col = 0; col < cal.column(currentDate); ++col) {
			let rows = [];

			for (let row = 0; row < 7; ++row) {
				let cellIndex = col * 7 + row;
				let day = cellIndex - cal.firstDay(currentDate) + 1;

				rows.push(
					<DayCell day={ day }
							 currentDate={ currentDate }
							 currentUser={ currentUser }
							 ymd={ [currentDate.getFullYear(), currentDate.getMonth(), day] }
							 events={ this.screenEvents(allEvents, currentDate, day) }
							 openLogin={ openLogin }
							 updateEvents={ updateEvents } 
							 key={ row } />
				);
			}

			grid.push (
				<div className="day-col" key={ col }>
					{ rows }
				</div>
			);
		}

		return grid;
	}

	render() {
		const grid = this.generateGrid();

		return (
			<main>
				<div className="week-col">
					<div className="week-cell">Sunday</div>
					<div className="week-cell">Monday</div>
					<div className="week-cell">Tuesday</div>
					<div className="week-cell">Wednesday</div>
					<div className="week-cell">Thursday</div>
					<div className="week-cell">Friday</div>
					<div className="week-cell">Saturday</div>
				</div>
				<div className="grid">
					{ grid }
				</div>

			</main>
		);
	}
}

export default Calendar;