import React, { Component } from 'react';
import './PopupEdit.css';

// Components
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MDSpinner from 'react-md-spinner';
import 'react-day-picker/lib/style.css';

// Functions
import check from './script/inputCheck.js';
import { editEvent, deleteEvent } from './script/fetchService.js';

class PopupEdit extends Component {
	constructor(props) {
		super(props);
		const tmpEvent= props.event;
		this.state = {
			event: {
				title: tmpEvent.title,
				description: tmpEvent.description,
				startDate: tmpEvent.startDate,
				endDate: tmpEvent.endDate,
				visibility: tmpEvent.visibility,
				location: tmpEvent.location,
				creator: tmpEvent.creator,
				_id: tmpEvent._id, 
			},
			warning: {
				title: '',
				date: '',
			},
			editLoading: false,
			deleteLoading: false,
		}

		this.handleEditEvent = this.handleEditEvent.bind(this);
		this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleStartDayChange = this.handleStartDayChange.bind(this);
		this.handleEndDayChange = this.handleEndDayChange.bind(this);
		this.resetLoading = this.resetLoading.bind(this);
		this.resetWarning = this.resetWarning.bind(this);
	}

	handleEditEvent() {
		let { event, warning } = this.state;
		const { updateEvents, closePopup } = this.props;

		if ( check.empty(event.title) || check.empty(event.startDate) || check.empty(event.endDate) ) {
			if ( check.empty(event.title) ) {
				warning.title = 'Title cannot be empty';
			}
			if ( check.empty(event.startDate) || check.empty(event.endDate) ) {
				warning.date = 'Start date and End date cannot be empty';
			}

			this.setState({
				warning,
			});
		}
		else {
			this.setState({
				editLoading: true,
			});

			editEvent(`user/event/${ event._id }`, event)
			.then( result => {
				if ( result.isUpdated ) {
					updateEvents();
					closePopup();
				}
			})
			.catch( error => {
				console.log(error);
				this.resetLoading();
			});
		}
	}

	handleDeleteEvent() {
		const { event, closePopup, updateEvents } = this.props;

		deleteEvent(`user/event/${ event._id }`, event)
		.then( result => {
			if ( result.isDeleted ) {
				updateEvents();
				closePopup();
			}
		})
		.catch( error => {
			console.log(error);
			this.resetLoading();
		});
	}

	handleInput(evt) {
		this.resetWarning();

		let event = this.state.event;
		event[evt.target.name] = evt.target.value;

		this.setState({
			event,
		});
	}

	handleCheckbox(evt) {
		let event = this.state.event;
		event[evt.target.name] = evt.target.checked ? 'public' : 'private';

		this.setState({
			event,
		});
	}

	handleStartDayChange(selectedDay) {
		this.resetWarning();

		let { event, warning } = this.state;
		selectedDay = new Date( selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate() );

		if ( check.chronologic( selectedDay, event.endDate ) ) {
			warning.date = 'Start date should not be late than End date';
			event.startDate = event.endDate;
			this.setState({
				event,
				warning,
			});
		}
		else {
			event.startDate = selectedDay;
			this.setState({
				event,
			});
		}
	}

	handleEndDayChange(selectedDay) {
		this.resetWarning();

		let { event, warning } = this.state;
		selectedDay = new Date( selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate() );

		if ( check.chronologic( event.startDate, selectedDay ) ) {
			warning.date = 'End date should not be early than End date';
			event.endDate = event.startDate;
			this.setState({
				event,
				warning,
			});
		}
		else {
			event.endDate = selectedDay;
			this.setState({
				event,
			});
		}
	}

	resetLoading() {
		this.setState({
			editLoading: false,
			deleteLoading: false,
		});
	}

	resetWarning() {
		this.setState({
			warning: {
				title: '',
				date: '',
			}
		});
	}

	render() {
		const { currentUser, closePopup } = this.props;
		const { event, warning, editLoading, deleteLoading } = this.state;
		const isCreator = currentUser.username === event.creator.username ? true : false;

		return (
			<div className="popup-edit">
				<div className="mask" onClick={ closePopup }></div>
				<div className="panel">
					<div className="field">
						<label htmlFor="title">Title<span className="warning">{ warning.title }</span></label>
						<input id="title" type="text" name="title" placeholder="Title" value={ event.title } onChange={ this.handleInput } />
					</div>
					<div className="field date">
						<label>Date<span className="warning">{ warning.date }</span></label>
						<div className="date-form">
							<DayPickerInput value={ event.startDate } onDayChange={ this.handleStartDayChange } />
							<span className="date-connector">to</span>
							<DayPickerInput value={ event.endDate } onDayChange={ this.handleEndDayChange } />
						</div>
					</div>
					<div className="field">
						<label htmlFor="location">Location</label>
						<input id="location" type="text" name="location" placeholder="Location" value={ event.location } onChange={ this.handleInput } />
					</div>
					{ isCreator ? (
						<div className="field">
							<label>Publicity</label>
							<div className="toggle-btn">
								<input id="publicity-btn" type="checkbox" name="visibility" checked={ event.visibility === 'public' ? true : false } onChange={ this.handleCheckbox } />
								<label className="btn-label" htmlFor="publicity-btn">
									<span className="circle"></span>
									<span className="text on">Public</span>
									<span className="text off">Private</span>
								</label>
							</div>
						</div>
						) : null
					}
					<div className="field">
						<label htmlFor="note">Note</label>
						<textarea id="note" type="text" placeholder="Note" name="description" value={ event.description } onChange={ this.handleInput } />
					</div>
					{ isCreator ? null : (
						<div className="field">
							<label htmlFor="creator">Creator</label>
							<div id="creator" className="creator">{ event.creator.username }</div>
						</div>
						)
					}
					<div className="field btn-group">
						<button className={ `btn-save ${ isCreator ? 'null' : 'btn-save-whole' }` } onClick={ this.handleEditEvent } >{ editLoading ? <MDSpinner size={ 15 } singleColor="#ffffff" /> : 'Save' }</button>
						{ isCreator ? <button className="btn-delete" onClick={ this.handleDeleteEvent } >{ deleteLoading ? <MDSpinner size={ 15 } singleColor="#ffffff" /> : 'Delete' }</button> : null }
					</div>
				</div>
			</div>
		);
	}
}

export default PopupEdit;