import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Home from "./components/Home";

const App = () => {
  return (
    <Router>
      <main>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;