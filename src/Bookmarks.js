import React, { useState } from 'react';
import { Accordion, Icon, Header, Image, Container } from 'semantic-ui-react';
import BookmarkTable from './BookmarkTable';
import BookmarkForm from './BookmarkForm';

const Bookmarks = ({ bookmarks, openForm, onClose, forceUpdate, parents }) => {
  const [activeFolder, setActiveFolder] = useState(-1);

  if (bookmarks.length === 0) {
    return (
      <div>
        <Header as="h3" icon textAlign="center">
          <Icon name="info" circular />
          <Header.Content>No bookmarks available.</Header.Content>
        </Header>
        <Image centered size="medium" src="https://react.semantic-ui.com/images/wireframe/centered-paragraph.png" />
      </div>
    );
  }

  const directChilds = bookmarks.filter(bookmark => !bookmark.children);
  const withFolders = bookmarks.filter(bookmark => bookmark.children);

  // Parent Folders
  const parentFolders = [
    ...parents,
    ...withFolders.map(bookmark => {
      return { text: bookmark.title, value: bookmark.id, key: bookmark.id };
    })
  ];

  return (
    <Container className="m-0" fluid>
      {withFolders.length > 0 && (
        <Accordion fluid styled>
          {withFolders.map((bookmark, index) => (
            <>
              <Accordion.Title
                active={activeFolder === index}
                index={index}
                onClick={() => setActiveFolder(activeFolder === index ? -1 : index)}
                key={bookmark.id}
                content={bookmark.title}
              />
              <Accordion.Content
                active={activeFolder === index}
                content={<BookmarkTable bookmarks={bookmark.children} forceUpdate={forceUpdate} parentFolders={parentFolders} />}
              />
            </>
          ))}
        </Accordion>
      )}

      <BookmarkTable bookmarks={directChilds} forceUpdate={forceUpdate} parentFolders={parentFolders} />
      <BookmarkForm open={openForm} onClose={onClose} parentFolders={parentFolders} />
    </Container>
  );
};

export default Bookmarks;
