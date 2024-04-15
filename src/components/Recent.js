import Icon from "./Icon";
import SimpleBar from "simplebar-react";
import { useState, useEffect } from "react";
import { List, Typography, Tooltip } from "antd";

const MAX_RECENT_ITEM = 25;
const { bookmarks } = window.chrome;

export default function Recent() {
  const [recentBookmarks, setRecentBookmarks] = useState([]);

  useEffect(() => {
    bookmarks.getRecent(MAX_RECENT_ITEM, setRecentBookmarks);
  }, []);

  return (
    <SimpleBar className='p-10px' style={{ maxHeight: "calc(100vh - 104px - 46px)" }}>
      <List
        dataSource={recentBookmarks}
        renderItem={({ title, url, dateAdded }, i) => (
          <List.Item className='nowrap gap-1'>
            <Typography.Link href={url} target='_blank'>
              {i + 1}. {title}
            </Typography.Link>

            <Tooltip placement='topRight' arrow={false} title={`Created on ${new Date(dateAdded).toString()}`}>
              <Icon name='info-circle' />
            </Tooltip>
          </List.Item>
        )}
      />
    </SimpleBar>
  );
}
