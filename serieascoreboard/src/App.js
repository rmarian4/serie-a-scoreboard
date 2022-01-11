import {Switch, Route} from 'react-router-dom';
import Leaders from './pages/Leaders';
import Fixtures from './pages/Fixtures';
import Table from './pages/Table';
import Layout from './Layout/Layout';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <Fixtures/>
        </Route>
        <Route path='/table'>
          <Table/>
        </Route>
        <Route path='/leaders'>
          <Leaders/>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
