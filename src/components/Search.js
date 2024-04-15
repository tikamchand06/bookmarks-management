import Icon from "./Icon";
import { useState } from "react";
import SimpleBar from "simplebar-react";
import { Modal, Button, Tooltip, Input, List, Typography } from "antd";

const { bookmarks } = window.chrome;

export default function Search() {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);

  const onSearch = (e) => {
    const query = e?.target?.value?.trim();

    if (query) bookmarks.search(query, setResults);
    else setResults([]);
  };

  return (
    <>
      <Tooltip title='Search'>
        <Button type='text' shape='circle' icon={<Icon name='search' />} onClick={() => setOpen(true)} />
      </Tooltip>

      <Modal open={open} title='Search Bookmark' onCancel={() => setOpen(false)} footer={null} styles={{ content: { padding: 16 } }}>
        <Input.Search autoFocus onChange={onSearch} placeholder='Search...' />
        <SimpleBar className='p-10px' style={{ maxHeight: "calc(100vh - 336px)" }}>
          <List
            dataSource={results}
            renderItem={({ title, url }, i) => (
              <List.Item className='nowrap gap-1'>
                <Typography.Link href={url} target='_blank'>
                  {i + 1}. {title}
                </Typography.Link>
              </List.Item>
            )}
          />
        </SimpleBar>
      </Modal>
    </>
  );
}
