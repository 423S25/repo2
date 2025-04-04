import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import AppContainer from './components/AppContainer';
import './App.css';

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{
      colors: {
        brand: ['#ECF6F7', '#D9EDF0', '#C6E4E8', '#B3DBE1', '#9FD2D9', '#8CC9D2', '#79C0CA', '#107178', '#005C62', '#00484D'],
      },
      primaryColor: 'brand',
      fontFamily: 'Poppins, sans-serif',
      headings: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 700,
      },
      components: {
        Button: {
          defaultProps: {
            color: 'var(--hrdc-teal)'
          }
        },
        Text: {
          defaultProps: {
            size: 'md'
          }
        }
      }
    }}>
      <Notifications />
      <div className="App">
        {/* Background pattern and decorative elements */}
        <div className="decorative-pattern"></div>
        <div className="decorative-shape-1"></div>
        <div className="decorative-shape-2"></div>
        
        <header className="App-header">
          <h1>HRDC Login Portal</h1>
          <p>Human Resource Development Council</p>
        </header>
        <main>
          <AppContainer />
        </main>
      </div>
    </MantineProvider>
  );
}

export default App;