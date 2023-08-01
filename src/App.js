import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import RecomendedVideos from "./components/recomendedvideos/RecomendedVideos";
import Sidebar from "./components/sidebar/Sidebar";
import SearchPage from "./components/searchpage/SearchPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="app__page">
                  {/* sidebar */}
                  <Sidebar />
                  {/* recommended videos */}
                  <RecomendedVideos />
                </div>
              </>
            }
          />
          <Route
            path="/search/:searchTerm"
            element={
              <div className="app__page">
                {/* sidebar */}
                <Sidebar />
                {/* recommended videos */}
                <SearchPage />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
      {/* header */}
    </div>
  );
}

export default App;
