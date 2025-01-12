import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider, Layout, FloatButton } from 'antd';
import { store } from './store/store';
import SearchBar from './components/SearchBar';
import PlaceList from './components/PlaceList';
import Map from './components/Map';
import { MapPin, List } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';
import { toggleMobileList } from './store/uiSlice';
import { useDispatch, useSelector } from 'react-redux';
const { Header, Sider, Content } = Layout;

const AppContent: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isMobile) {
      dispatch(toggleMobileList(false));
    }
  }, [isMobile, dispatch]);

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-logo">
          <MapPin className="logo-icon" />
          <h1 className="app-title">Place Finder</h1>
        </div>
        <div className="search-container">
          <SearchBar />
        </div>
      </Header>
      <Layout>
        {!isMobile && (
          <Sider
            width={400}
            theme="light"
            className="sider-container"
          >
            <PlaceList />
          </Sider>
        )}
        <Content className="content-container">
          <Map />
          {isMobile && (
            <div className="mobile-list">
              <div className="mobile-list-content">
                <PlaceList />
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#3b82f6',
            borderRadius: 8,
            padding: 16
          },
          components: {
            Card: {
              bodyPadding: 16
            }
          }
        }}
      >
        <AppContent />
      </ConfigProvider>
    </Provider>
  );
};

export default App;