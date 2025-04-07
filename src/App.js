/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 1234567.89,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  addCredit = (credit) => {
    const newCreditList = [...this.state.creditList, credit];
    this.setState({
      creditList: newCreditList,
      accountBalance: this.calculateAccountBalance(newCreditList, this.state.debits),
    });
  }

  addDebit = (debit) => {
    const newDebitList = [...this.state.debitList, debit];
    this.setState({ 
      debitList: newDebitList, 
      accountBalance: this.calculateAccountBalance(this.state.creditList, newDebitList) 
    });
  };

  calculateAccountBalance = (creditList = [], debitList = []) => {
    const totalCredits = creditList.reduce((sum, credit) => sum + credit.amount, 0);
    const totalDebits = debitList.reduce((sum, debit) => sum + debit.amount, 0);
    return (totalCredits - totalDebits).toFixed(2);
  }
  
  componentDidMount() {
    const creditsUrl = 'https://johnnylaicode.github.io/api/credits.json';
    const debitsUrl = 'https://johnnylaicode.github.io/api/debits.json';
  
    Promise.all([fetch(creditsUrl), fetch(debitsUrl)])
      .then(async ([creditsRes, debitsRes]) => {
        const creditList = await creditsRes.json();
        const debitList = await debitsRes.json();
        this.setState({ 
          creditList, 
          debitList, 
          accountBalance: this.calculateAccountBalance(creditList, debitList) 
        });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)

    const CreditsComponent = () => (
      <Credits 
        credits={this.state.creditList} 
        addCredit={this.addCredit} 
        />
      );

    const DebitsComponent = () => (
      <Debits 
        debits={this.state.debitList} 
        addDebit={this.addDebit} 
        />
      ); 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react-starter-code">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;