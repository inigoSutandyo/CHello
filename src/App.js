import './App.css';
import {FaBeer} from 'react-icons/fa'
import { Login } from './views/user/Login';
import { Register } from './views/user/Register';

function App() {
  return (
    <div className="App">
      {/* Navbar */}
      <nav class="navbar navbar-expand-lg bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">CHello</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link" aria-current="page" href="#">Workspace</a>
              <a class="nav-link" href="#">Account</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div>
        <Register/>
        <Login/>
      </div>
      
    </div>
  );
}

export default App;
