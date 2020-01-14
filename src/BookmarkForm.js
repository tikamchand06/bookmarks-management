import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';

const BookmarkForm = ({ open, onClose, bookmarkId, parentFolders, forceUpdate }) => {
  const chrome = window.chrome;
  const [state, setState] = useState({ parentId: null, title: '', url: '', isBookmark: true });
  const { title, url, parentId, isBookmark } = state;

  useEffect(() => {
    if (bookmarkId) {
      chrome.bookmarks.get(bookmarkId, res => {
        if (res && res.length > 0) {
          const { parentId, title, url } = res[0];
          setState({ ...state, parentId, title, url });
        }
      });
    }
  }, [bookmarkId]);

  const options = isBookmark ? parentFolders : parentFolders.filter(folder => folder.isMain);

  const onChange = (e, props) => setState({ ...state, [props.name]: props.value });
  const onSubmit = e => {
    e.preventDefault();
    if (title && parentId) {
      const data = { title };
      if (!bookmarkId) data.parentId = parentId;
      if (isBookmark) data.url = url;

      if (bookmarkId) chrome.bookmarks.update(bookmarkId, data, onClose);
      else chrome.bookmarks.create(data, onClose);

      forceUpdate();
    }
  };

  return (
    <Modal size="mini" open={open} onClose={onClose} closeIcon>
      <Modal.Header content={`${bookmarkId ? 'Update' : 'Add'} Bookmark/Folder`} />
      <Modal.Content
        content={
          <Form onSubmit={onSubmit}>
            <Button.Group className="mb-2" fluid primary disabled={bookmarkId}>
              <Button
                icon="bookmark"
                content="Bookmark"
                active={isBookmark}
                onClick={() => setState({ ...state, isBookmark: true })}
              />
              <Button icon="folder" content="Folder" active={!isBookmark} onClick={() => setState({ ...state, isBookmark: false })} />
            </Button.Group>

            <Form.Select
              fluid
              label="Parent Folder"
              options={options}
              placeholder="Parent Folder"
              value={parentId}
              name="parentId"
              onChange={onChange}
              error={!parentId}
              disabled={bookmarkId}
            />
            <Form.Input
              fluid
              label="Title"
              placeholder="Title..."
              icon="pencil alternate"
              iconPosition="left"
              value={title}
              name="title"
              onChange={onChange}
              error={!title}
            />
            {isBookmark && (
              <Form.Input
                fluid
                label="URL"
                placeholder="URL..."
                icon="globe"
                iconPosition="left"
                value={url}
                name="url"
                onChange={onChange}
                error={!url}
              />
            )}
            <Form.Button
              content={`${bookmarkId ? 'Update' : 'Add'} ${isBookmark ? 'Bookmark' : 'Folder'}`}
              icon="save"
              positive
              fluid
            />
          </Form>
        }
      />
    </Modal>
  );
};

export default BookmarkForm;
