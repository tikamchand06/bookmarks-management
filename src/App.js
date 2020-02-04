import React, { useEffect, useState } from 'react';
import { Container, Segment, Icon, Image, Tab, Popup, Header } from 'semantic-ui-react';
import Bookmarks from './Bookmarks';
import BookmarkSearch from './BookmarkSearch';
import logo from './logo.png';

const App = () => {
  const MAX_RECENT_ITEM = 25;
  const [isRecentPage, setRecentPage] = useState(false);
  const [recentBookmarks, setRecentBookmarks] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [bookmarks, setBookmarks] = useState(null);

  const init = () => {
    window.chrome.bookmarks.getTree(tree => setBookmarks(tree[0].children));
    window.chrome.bookmarks.getRecent(MAX_RECENT_ITEM, items => setRecentBookmarks(items));
  };

  useEffect(() => {
    init();
  }, []);

  let panes = [];
  let parentFolders = [];
  if (bookmarks && !isRecentPage) {
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
        <BookmarkSearch />
        <div className="main-menu">
          <Popup content="Home" trigger={<Icon name="home" onClick={() => setRecentPage(false)} link />} inverted basic />
          {!isRecentPage && (
            <Popup content="Add New" trigger={<Icon name="add circle" onClick={() => setOpenForm(true)} link />} inverted basic />
          )}
          <Popup content="Recent History" trigger={<Icon name="history" onClick={() => setRecentPage(true)} link />} inverted basic />
          <Popup
            content="Help - Contact Me"
            trigger={
              <a href="http://www.tcmhack.in/contact-us" target="_blank">
                <Icon name="help circle" />
              </a>
            }
            inverted
            basic
          />
          <Popup content="Close Window" trigger={<Icon name="shutdown" onClick={() => window.close()} link />} inverted basic />
        </div>
      </Segment>

      {!isRecentPage && (
        <Segment
          basic
          className="body pt-0"
          loading={!bookmarks}
          content={<Tab menu={{ secondary: true, pointing: true }} panes={panes} />}
        />
      )}

      {isRecentPage && (
        <Segment className="body" basic loading={!recentBookmarks}>
          <Header as="h3" content="Recent Bookmarks" color="blue" />
          {recentBookmarks && <Bookmarks bookmarks={recentBookmarks} forceUpdate={init} parents={parentFolders} />}
        </Segment>
      )}

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
