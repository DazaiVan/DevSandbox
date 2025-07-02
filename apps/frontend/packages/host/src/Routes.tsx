import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RemoteAppCIM from 'remoteAppCIM/App';
import RemoteAppIssues from 'remoteAppIssues/App';
import LayoutComponent from './assets/LayoutComponent';

const RouterComponent = () => {
    return (
        <Router>
            <Routes>
              <Route path="/" element={<LayoutComponent />} >
                  <Route path="CIM" element={<RemoteAppCIM />} />
                  <Route path="Issues" element={<RemoteAppIssues />} />
              </Route>
            </Routes>
        </Router>
    )
}