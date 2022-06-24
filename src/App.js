import './App.css';
import { Login } from './views/pages/user/Login';
import { Register } from './views/pages/user/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorPage } from './views/pages/main/ErrorPage';
import { useEffect, useState } from 'react';
import { GuestNavbarComponent } from './views/components/GuestNavbarComponent';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './util/FireBaseConfig';
import { AuthNavbarComponent } from './views/components/AuthNavbarComponent';
import { WorkspacePage } from './views/pages/main/WorkspacePage';
import { GuestPage } from './views/pages/main/GuestPage';
import { BoardPage } from './views/pages/main/BoardPage';


function App() {
  const [userSession, setUserSession] = useState({})

  onAuthStateChanged(auth, (currentUser) => {
    setUserSession(currentUser);
  })

  // useEffect(() => {
  //   setIsAuth(checkAuth())
  // }, [checkAuth()])
  

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">CHello</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
                {userSession==null && <GuestNavbarComponent />}
                {userSession!=null && <AuthNavbarComponent email={userSession.email} />}
            </div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path='/' element={<GuestPage/>} />
        <Route path='/workspace' element={userSession!=null && <WorkspacePage userId={'8GUZ2Um6WvTPw7wJqYntnObTemI2'}/>} />
        <Route path='/workspace/:workspaceId' element={<BoardPage userId={'8GUZ2Um6WvTPw7wJqYntnObTemI2'}/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />

        <Route path='*' element={<ErrorPage/>}/>
      </Routes>
    </BrowserRouter>
    // <div className="App">
      

  );
}

export default App;
