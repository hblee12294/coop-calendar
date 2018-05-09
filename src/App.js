import React, { Component } from 'react';
import './App.css';

// Components
import Header from './Header';
import Calendar from './Calendar';
import Modal from './Modal';
import PopupAdd from './PopupAdd';
import Login from './Login';
import MDSpinner from 'react-md-spinner';

// Functions
import cal from './script/dateCalculator.js';
import { getUserEvents, userLogout } from './script/fetchService.js';
import cookie from 'react-cookies';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: cal.today(),
			currentUser: cookie.loadAll().user ? JSON.parse(cookie.loadAll().user) : {},
			events: [],
			isLoginOpen: false,
			isPopupAddOpen: false,
			isLoading: false,
		};

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.getEvents = this.getEvents.bind(this);
		this.pageUp = this.pageUp.bind(this);
		this.pageDown = this.pageDown.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.jumpToday = this.jumpToday.bind(this);
		this.togglePopupAdd = this.togglePopupAdd.bind(this);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.toggleLoading = this.toggleLoading.bind(this);
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);
		this.getEvents();
	}

	login(user) {
		this.setState( prevState => {
			prevState.user = user;
			return { currentUser: prevState.user };
		});
		this.getEvents();
	}

	logout() {
		cookie.remove('user');
		userLogout('logout')
		.then( result => {
			if (!result.isLogin) {
				this.setState({
					currentDate: cal.today(),
					currentUser: {},
					events: [],
					searchContent: '',
					isLoginOpen: false,
					isPopupAddOpen: false,
				});
			}
		})
		.catch( error => {
			console.log(error);
		})
	}

	getEvents() {
		const { currentDate, currentUser } = this.state;
		let { events } = this.state;

		if ( currentUser.id ) {
			this.toggleLoading();

			getUserEvents(`user/${ currentUser.id }/${ currentDate.getFullYear() }/${ currentDate.getMonth() }`)
			.then(result => {
				events = result.sendEvents.map( event => {
					event.startDate = new Date( event.startDate );
					event.endDate = new Date( event.endDate );
					return event;
				} );

				this.toggleLoading();
				this.setState({
					events: events,
				});
			})
			.catch(error => {
				console.log(error);
				this.toggleLoading();
			});
		}
	}

	pageUp() {
		this.setState( prevState => {
			let newDate = cal.previousMonth(prevState.currentDate);
			this.getEvents();
			return { currentDate: newDate, };
		});
	}

	pageDown() {
		this.setState( prevState => {
			let newDate = cal.nextMonth(prevState.currentDate);
			this.getEvents();
			return { currentDate: newDate, };
		});
	}

	handleKeyDown(event) {
		switch(event.keyCode) {
			case 33:
				this.pageUp(); break;
			case 34:
				this.pageDown(); break;
			default:
				break;
		}
	}

	jumpToday(event) {
		this.setState( prevState => {
			prevState.currentDate = cal.today();
			this.getEvents( prevState.currentDate );
			return { currentDate: prevState.currentDate, };
		});
		event.target.blur();
	}

	togglePopupAdd() {
		this.setState( prevState => ({
			isPopupAddOpen: !prevState.isPopupAddOpen,
			isPopupEditOpen: false,
		}));
	}

	toggleLogin() {
		this.setState( prevState => ({
			isLoginOpen: !prevState.isLoginOpen,
		}))
	}

	toggleLoading() {
		this.setState( prevState => ({
			isLoading: !prevState.isLoading,
		}))
	}

  	render() {
  		const { currentDate, currentUser, events } = this.state;
  		const { isLoginOpen, isPopupAddOpen, isLoading } = this.state;

    	return (
      		<div className="App">
      			{ isLoading ? <div className="event-loader"><MDSpinner size={ 18 } color1='#1e824c' color2='#2574a9' color3='#e87e04' color4='#797979' /></div> : null }
		      	<Header 
		      		currentMonth={ currentDate.getMonth() }
		      		currentYear={ currentDate.getFullYear() }
		      		currentUser={ currentUser }
		      		clickLeft={ this.pageUp }
		      		clickRight={ this.pageDown }
		      		clickToday={ this.jumpToday }
		      		clickAdd={ this.togglePopupAdd }
		      		clickLogin={ this.toggleLogin }
		      		clickLogout={ this.logout } />
		      	<Calendar
		      		currentDate={ currentDate }
		      		currentUser={ currentUser }
		      		allEvents={ events }
		      		openLogin={ this.toggleLogin }
		      		updateEvents={ this.getEvents } />
		      	<Modal>
		      		{ isPopupAddOpen ? <PopupAdd currentUser={ currentUser } closePopup={ this.togglePopupAdd } updateEvents={ this.getEvents } /> : null }
					{ isLoginOpen ? <Login login={ this.login } closePage={ this.toggleLogin } /> : null }
				</Modal>
	      	</div>
	    );
	  }
}

export default App;
