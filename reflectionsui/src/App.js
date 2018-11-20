import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./components/xnavBar";
import Home from "./components/home";
import Maps from "./components/maps";
import Images from "./components/images";
import About from "./components/about";
import Login from "./components/login";
import MapForm from "./components/mapForm";
import HotSpotsEditor from "./components/hotSpotsEditor";
import HotSpotForm from "./components/hotSpotForm";
import NotFound from "./components/notFound";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container">
          <div>
            <Switch>
              <Route path="/maps/:mapName" component={Maps} />
              <Route path="/maps" component={Maps} />
              <Route path="/images" component={Images} />
              <Route path="/about" component={About} />
              <Route path="/login" component={Login} />
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
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
