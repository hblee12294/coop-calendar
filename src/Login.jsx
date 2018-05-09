import React, { Component } from 'react';
import './Login.css';
// import 'react-tabs/style/react-tabs.css';

// Component
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MDSpinner from 'react-md-spinner';

// Assets
import google from './icon/icon-google.svg';

// Functions
import check from './script/inputCheck.js';
import { userLogin, userSignup } from './script/fetchService.js';


class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loginInfo: {
				username: '',
				password: '',
			},
			signupInfo: {
				username: '',
				password: '',
				vpassword: '',
			},
			loginWarning: {
				uname: '',
				pword: '',
			},
			signupWarning: {
				uname: '',
				pword: '',
				vpword: '',
			},
			loginLoading: false,
			signupLoading: false,
			tabIndex: 0,
		};

		this.handleInput = this.handleInput.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
		this.resetLoginInput = this.resetLoginInput.bind(this);
		this.resetSignupInput = this.resetSignupInput.bind(this);
		this.resetLoading = this.resetLoading.bind(this);
	}

	handleInput(evt) {
		let { loginInfo, signupInfo } = this.state;
		let sec = evt.target.id.split('-');

		if ( sec[0] === 'login' ) {
			loginInfo[ sec[1] ] = evt.target.value;
			this.setState({
				loginInfo,
				loginWarning: {
					uname: '',
					pword: '',
				},
			});
		}
		else {
			signupInfo[ sec[1] ] = evt.target.value;
			this.setState({
				signupInfo,
				signupWarning: {
					uname: '',
					pword: '',
					vpword: '',
				}
			});
		}
	}

	handleLogin() {
		const { loginInfo, loginWarning } = this.state;
		const { login, closePage } = this.props;

		if ( check.empty( loginInfo.username ) || check.empty( loginInfo.password ) ) {
			if ( check.empty( loginInfo.username ) ) {
				loginWarning.uname = 'Username can not be empty';
			}
			if ( check.empty( loginInfo.password ) ) {
				loginWarning.pword = 'Password can not be empty';
			}

			this.setState({
				loginWarning,
			});
		}
		else {
			this.setState({
				loginLoading: true,
			});

			userLogin('login', loginInfo)
			.then( result => {             
				if ( result.isLogin ) {
					login({ 
						id: result.userId,
						username: result.username,
						});
					closePage();
				}
				else {
					loginWarning.uname = result.msg; 
					this.setState({
						loginWarning,
					});
					this.resetLoginInput();
					this.resetLoading();
				}
			})
			.catch( error => {
				console.log(error);
				this.resetLoginInput();
				this.resetLoading();
			});
		}
	}

	handleSignup() {
		const { signupInfo, signupWarning } = this.state;

		if ( check.empty( signupInfo.username ) || check.empty( signupInfo.password ) || check.empty( signupInfo.vpassword ) ) {
			if ( check.empty( signupInfo.username ) ) {
				signupWarning.uname = 'Username can not be empty';
			}
			if ( check.empty( signupInfo.password) ) {
				signupWarning.pword = 'Password can not be empty';
			}
			if ( check.empty( signupInfo.vpassword ) ) {
				signupWarning.vpword = 'Please confirm your password';
			}

			this.setState({
				signupWarning,
			})
		}
		else if ( !check.vpword( signupInfo.vpassword, signupInfo.password ) ) {
			signupWarning.vpword = 'Password does not match';

			this.setState({
				signupWarning,
			});
		}
		else {
			this.setState({
				signupLoading: true,
			});

			userSignup('register', signupInfo)
			.then( result => {
				if ( result.isRegister ) {
					this.setState({
						tabIndex: 0,
					});
					this.resetLoading();
				}
				else {
					signupWarning.uname = result.msg; 
					this.setState({
						signupWarning,
					});
					this.resetSignupInput();
					this.resetLoading();
				}
			})
			.catch( error => {
				console.log(error);
				this.resetLoading();
			} );
		}

	}

	resetLoginInput() {
		this.setState({
			loginInfo: {
				username: '',
				password: '',
			},
		});
	}

	resetSignupInput() {
		this.setState({
			signupInfo: {
				username: '',
				password: '',
				vpassword: '',
			},
		});
	}

	resetLoading() {
		this.setState({
			loginLoading: false,
			signupLoading: false,
		});
	}

	render() {
		const { loginInfo, signupInfo } = this.state;
		const { loginWarning, signupWarning } = this.state;
		const { loginLoading, signupLoading } = this.state;
		const { tabIndex } = this.state;

		return (
			<div className="login-modal">
				<span className="btn-close" onClick={ this.props.closePage }></span>
				<div className="panel">
					<Tabs selectedIndex={ tabIndex } onSelect={ tabIndex => this.setState({ tabIndex }) }>
						<TabList>
							<Tab>Log In</Tab>
							<Tab>Sign Up</Tab>
						</TabList>

						<TabPanel>
							<div className="tab-container">
								<div className="field">
									<label htmlFor="login-username">Username<span className="warning">{ loginWarning.uname }</span></label>
									<input id="login-username" type="text" placeholder="Username" value={ loginInfo.username } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<label htmlFor="login-password">Password<span className="warning">{ loginWarning.pword }</span></label>
									<input id="login-password" placeholder="Password" type="password" value={ loginInfo.password } onChange={ this.handleInput } />
								</div>
								<div className="field btn-group">
									<button onClick={ this.handleLogin } >{ loginLoading ? <MDSpinner size={ 15 } singleColor="#ffffff" /> : 'Log In' }</button>
									<a className="btn-google" href="http://localhost:5000/auth/google"><img src={ google } alt="google" />Google</a>
								</div>
							</div>
						</TabPanel>
						<TabPanel>
							<div className="tab-container">
								<div className="field">
									<label htmlFor="signup-uname">Username<span className="warning">{ signupWarning.uname }</span></label>
									<input id="signup-username" type="text" placeholder="Username" value={ signupInfo.username } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<label htmlFor="signun-password">Password<span className="warning">{ signupWarning.pword }</span></label>
									<input id="signup-password" type="password" placeholder="Password" value={ signupInfo.password } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<label htmlFor="signup-vpassword">Confirm Password<span className="warning">{ signupWarning.vpword }</span></label>
									<input id="signup-vpassword" type="password" placeholder="Confirm Password" value={ signupInfo.vpassword } onChange={ this.handleInput } />
								</div>
								<div className="field btn-group">
									<button onClick={ this.handleSignup }>{ signupLoading ? <MDSpinner size={ 15 } singleColor="#ffffff" /> : 'Create Account' }</button>
								</div>
							</div>
						</TabPanel>
					</Tabs>
				</div>
			</div>
		);
	}
}

export default Login;