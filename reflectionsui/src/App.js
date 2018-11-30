import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/navBar";
import Home from "./components/home";
import Maps from "./components/maps";
import Images from "./components/images";
import About from "./components/about";
import Logout from "./components/logout";
import MapForm from "./components/mapForm";
import HotSpotsEditor from "./components/hotSpotsEditor";
import HotSpotForm from "./components/hotSpotForm";
import NotFound from "./components/notFound";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar />
        <main className="fullHeight container" style={{ maxWidth: "none" }}>
          <Switch>
            <Route path="/maps/:mapName" component={Maps} />
            <Route path="/maps" component={Maps} />
            <Route path="/images" component={Images} />
            <Route path="/about" component={About} />
            <Route path="/logout" component={Logout} />
            <Route path="/mapform/:id" component={MapForm} />
            <Route path="/hotspotseditor/:id" component={HotSpotsEditor} />
            <Route
              path="/hotspotform/:mapId/hotSpot/:hotSpotId"
              component={HotSpotForm}
            />
            <Route path="/notfound" component={NotFound} />
            <Route path="/" component={Home} exact />
            <Redirect to="/notfound" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
