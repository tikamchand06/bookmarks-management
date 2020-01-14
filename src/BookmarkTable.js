import React, { useState } from 'react';
import { Table, Icon, Popup, Dropdown, Confirm } from 'semantic-ui-react';
import BookmarkForm from './BookmarkForm';

const BookmarkTable = ({ bookmarks, forceUpdate, parentFolders }) => {
  const chrome = window.chrome;
  const [state, setState] = useState({ bookmarkId: null, showConfirm: false, openForm: false });
  const { bookmarkId, showConfirm, openForm } = state;

  const getFormatedDate = timestamp => new Date(timestamp).toDateString();
  const resetState = () => setState({ ...state, bookmarkId: null, showConfirm: false, openForm: false });

  const onConfirm = () => {
    chrome.bookmarks.remove(bookmarkId, () => {
      resetState();
      forceUpdate();
    });
  };
  const moveIntoFolder = (parentId, bookmarkID) => chrome.bookmarks.move(bookmarkID, { parentId }, forceUpdate);

  return (
    <Table celled unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell content="TITLE" />
          <Table.HeaderCell content="ACTION" width="2" textAlign="center" />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {bookmarks.map(bookmark => (
          <Table.Row key={bookmark.id}>
            <Table.Cell
              content={
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  {bookmark.title}
                </a>
              }
            />
            <Table.Cell textAlign="center">
              <Popup
                content={'Created On: ' + getFormatedDate(bookmark.dateAdded)}
                trigger={<Icon name="info circle" />}
                position="top right"
                inverted
              />
              <Dropdown icon="ellipsis vertical" direction="left" compact>
                <Dropdown.Menu>
                  <Dropdown.Item
                    icon="edit"
                    text="Edit"
                    onClick={() => setState({ ...state, bookmarkId: bookmark.id, openForm: true })}
                  />
                  <Dropdown.Item
                    content={
                      <Dropdown text="Move to">
                        <Dropdown.Menu>
                          <Dropdown.Header content="Choose Folder" />
                          {parentFolders.map(folder => (
                            <Dropdown.Item
                              key={folder.key}
                              text={folder.text}
                              onClick={() => moveIntoFolder(folder.value, bookmark.id)}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    }
                  />
                  <Dropdown.Item
                    icon="trash"
                    text="Delete"
                    onClick={() => setState({ ...state, bookmarkId: bookmark.id, showConfirm: true })}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Table.Cell>
          </Table.Row>
        ))}
        {bookmarks.length === 0 && <Table.Row content={<Table.Cell content="No bookmarks available in this folder." colSpan="2" />} />}
      </Table.Body>

      <Confirm open={showConfirm} onCancel={resetState} onConfirm={onConfirm} />
      <BookmarkForm open={openForm} onClose={resetState} bookmarkId={bookmarkId} parentFolders={parentFolders} />
    </Table>
  );
};

export default BookmarkTable;
