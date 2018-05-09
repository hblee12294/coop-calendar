import React from 'react';
import './Header.css';

const Header = ( { currentMonth, currentYear, currentUser, clickLeft, clickRight, clickToday, clickAdd, clickLogin, clickLogout } ) => {
	const monthStr= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const isLogin = currentUser.username ? true : false;

	return (
		<header>
			<div className="panel">
				<div className="date-control">
					<div className="paging">
						<div className="dropdown">
							<svg className="left-icon" onClick={ clickLeft } fill="#b1b1b1" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
							</svg>
							<span className="tip">fn+↑</span>
						</div>
						<button className="today" onClick={ clickToday }>Today</button>
						<div className="dropdown">
							<svg className="right-icon" onClick={ clickRight } fill="#b1b1b1" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
							</svg>
							<span className="tip">fn+↓</span>
						</div>
					</div>
					<div className="display">{ `${ monthStr[currentMonth] } ${ currentYear }` }</div>
				</div>
				{ /*
				<div className="search">
					<input type="text" />
					<svg className="search-icon" fill="#b1b1b1" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
					</svg>
				</div>
				*/}
				<div className="tools">
					{ isLogin ?  <div onClick={ clickAdd } className="btn-add">Add Event</div> : null }
					<div className={ `login ${ isLogin ? '' : 'unlogin' }` }>
						<div className="dropdown">
							<div className="login-content">
									<a onClick={ clickLogout }>Logout</a>
							</div>
							<span className="username" onClick={ isLogin ? null : clickLogin }>{ currentUser.username || 'Login' }</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);	
};

export default Header;