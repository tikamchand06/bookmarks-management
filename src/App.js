import React, { useEffect, useState } from 'react';
import { Container, Segment, Icon, Image, Tab, Popup } from 'semantic-ui-react';
import Bookmarks from './Bookmarks';
import logo from './logo.png';

const App = () => {
  const HOME = 'home';
  const RECENT = 'recent';
  const [activePage, setActivePage] = useState(HOME);
  const [openForm, setOpenForm] = useState(false);
  const [bookmarks, setBookmarks] = useState(null);

  const init = () => window.chrome.bookmarks.getTree(tree => setBookmarks(tree[0].children));
  useEffect(() => {
    init();
  }, []);

  let panes = [];
  let parentFolders = [];
  if (bookmarks) {
    // Parent Folders
    parentFolders = bookmarks.map(bookmark => {
      return { text: bookmark.title, value: bookmark.id, key: bookmark.id, isMain: true };
    });

    // Bookmarks
    panes = bookmarks.map(bookmark => {
      return {
        menuItem: bookmark.title,
        render: () => (
          <Bookmarks
            bookmarks={bookmark.children}
            forceUpdate={init}
            parents={parentFolders}
            openForm={openForm}
            onClose={() => setOpenForm(false)}
          />
        )
      };
    });
  }

  return (
    <Container fluid className="m-0">
      <Segment className="mb-2px flex-item">
        <Image src={logo} size="small" />
        <div className="main-menu">
          <Popup content="Home" trigger={<Icon name="home" onClick={() => setActivePage(HOME)} link />} inverted basic />
          <Popup content="Add New" trigger={<Icon name="add circle" onClick={() => setOpenForm(true)} link />} inverted basic />
          <Popup
            content="Recent History"
            trigger={<Icon name="history" onClick={() => setActivePage(RECENT)} link />}
            inverted
            basic
          />
          <Popup
            content="Help - Contact Me"
            trigger={
              <a href="http://www.tcmhack.in/contect-us" target="_blank">
                <Icon name="help circle" />
              </a>
            }
            inverted
            basic
          />
          <Popup content="Close Window" trigger={<Icon name="shutdown" onClick={() => window.close()} link />} inverted basic />
        </div>
      </Segment>

      <Segment className="body pt-0" basic loading={!bookmarks}>
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </Segment>

      <Segment className="mt-2px footer flex-item">
        <span>
          <Icon name="copyright outline" />
          {new Date().getFullYear()}{' '}
          <a href="http://www.tcmhack.in" className="text-white" target="_blank" rel="noopener noreferrer">
            TCMHACK
          </a>
        </span>
        <span>
          Made with <Icon name="heart" color="pink" /> at Jaipur
        </span>
      </Segment>
    </Container>
  );
};

export default App;
