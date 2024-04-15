import Add from "./Add";
import Icon from "./Icon";
import SimpleBar from "simplebar-react";
import { getFolders } from "./utils";
import { useState, useEffect } from "react";
import { App, Collapse, Typography, Tooltip, List, Button, Dropdown, Modal } from "antd";

const { Text } = Typography;
const { bookmarks } = window.chrome;

export default function All({ tree, updateTree = () => {} }) {
  const { message, modal } = App.useApp();
  const [editObj, setEditObj] = useState(null);
  const [activeKey, setActiveKey] = useState([]);

  useEffect(() => {
    setActiveKey(tree?.map((t) => t?.id));
  }, [tree]);

  const items = tree?.map((t) => {
    const items = t?.children?.filter((b) => !b?.children);
    const folders = t?.children?.filter((b) => b?.children);

    const foldersItems = folders?.map((f) => ({
      key: f?.id,
      className: "fw-500",
      children: <BookmarkList tree={tree} children={f?.children} setEditObj={setEditObj} updateTree={updateTree} />,
      label: (
        <div className='flex-item gap-1 space-between'>
          <Text ellipsis={{ tooltip: true }}>
            {f?.title} ({f?.children?.length})
          </Text>

          <div className='flex-item gap-1' onClick={(e) => e.stopPropagation()}>
            <Tooltip title='Rename'>
              <Button
                type='text'
                size='small'
                shape='circle'
                icon={<Icon name='pencil' />}
                onClick={() => setEditObj({ ...f, type: "folder" })}
              />
            </Tooltip>

            <Tooltip title='Delete'>
              <Button
                danger
                type='text'
                size='small'
                shape='circle'
                icon={<Icon name='trash' />}
                onClick={() =>
                  modal.confirm({
                    okText: "Delete",
                    title: "Confirm Delete?",
                    okButtonProps: { danger: true, type: "primary" },
                    onOk: () => {
                      bookmarks.removeTree(f?.id, () => {
                        updateTree();
                        message.success(`Folder "${f?.title}" deleted successfully.`);
                      });
                    },
                    content:
                      "Are you sure you want to delete? This action is irreversible. All bookmarks inside this folder will be deleted.",
                  })
                }
              />
            </Tooltip>
          </div>
        </div>
      ),
    }));

    return {
      key: t?.id,
      label: (
        <Text strong>
          {t?.title} ({t?.children?.length})
        </Text>
      ),
      children: (
        <>
          <Collapse
            bordered={false}
            items={foldersItems}
            expandIcon={({ isActive }) => <Icon name={`folder${isActive ? "-open" : ""}`} />}
          />
          <BookmarkList tree={tree} children={items} setEditObj={setEditObj} updateTree={updateTree} />
        </>
      ),
    };
  });

  return (
    <SimpleBar className='p-10px' style={{ maxHeight: "calc(100vh - 104px - 46px)" }}>
      <Collapse
        accordion
        items={items}
        bordered={false}
        activeKey={activeKey}
        onChange={setActiveKey}
        expandIcon={({ isActive }) => <Icon name={`folder${isActive ? "-open" : ""}`} />}
      />

      <Add tree={tree} showAddBtn={false} updateTree={updateTree} editObj={editObj} setEditObj={setEditObj} />
    </SimpleBar>
  );
}

function BookmarkList({ tree, children, setEditObj = () => {}, updateTree = () => {} }) {
  const fldrs = getFolders(tree);
  const { message, modal } = App.useApp();
  const [moveItem, setMoveItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const items = [
    { key: "edit", label: "Edit", icon: <Icon name='pencil-square' /> },
    { key: "move", label: "Move to", icon: <Icon name='folder-plus' /> },
    { key: "delete", label: "Delete", icon: <Icon name='trash' />, danger: true },
  ];

  const onClick = ({ key, item }) => {
    if (key === "move") setMoveItem(item);
    if (key === "edit") setEditObj({ ...item, type: "bookmark" });
    if (key === "delete") {
      modal.confirm({
        okText: "Delete",
        title: "Confirm Delete?",
        okButtonProps: { danger: true, type: "primary" },
        onOk: () => {
          bookmarks.remove(item?.id, () => {
            updateTree();
            message.success(`Bookmark deleted successfully.`);
          });
        },
        content: "Are you sure you want to delete? This action is irreversible.",
      });
    }
  };

  return (
    <>
      <List
        size='small'
        dataSource={children}
        itemLayout='horizontal'
        renderItem={(item, i) => (
          <List.Item className='nowrap gap-1 p-8px'>
            <Typography.Link href={item?.url} target='_blank'>
              {i + 1}. {item?.title}
            </Typography.Link>

            <Dropdown menu={{ items, onClick: ({ key }) => onClick({ key, item }) }} trigger={["click"]}>
              <Button type='text' shape='circle' icon={<Icon name='three-dots-vertical' />} />
            </Dropdown>
          </List.Item>
        )}
      />

      <Modal
        okText='Move'
        title='Choose a folder'
        open={moveItem !== null}
        onCancel={() => setMoveItem(null)}
        styles={{ content: { padding: 16 } }}
        okButtonProps={{ icon: <Icon name='folder-symlink' /> }}
        onOk={() => {
          bookmarks.move(moveItem?.id, { parentId: selectedId }, () => {
            updateTree();
            setMoveItem(null);
            setSelectedId(null);
            message.success("Bookmark moved successfully.");
          });
        }}
      >
        <SimpleBar style={{ maxHeight: "calc(100vh - 390px)" }}>
          <List
            bordered
            size='small'
            dataSource={fldrs?.allFolders}
            renderItem={(f) => (
              <List.Item
                onClick={() => setSelectedId(f?.id)}
                className={`pointer fw-500 flex-item gap-1 space-between ${f?.id === moveItem?.parentId ? "disabled" : ""} ${
                  f?.id === selectedId || f?.id === moveItem?.parentId ? "bg-E3F2FD" : "h-bg-fafafa"
                }`}
              >
                <div className='flex-item gap-1'>
                  <Icon name='folder' /> {f?.title}
                </div>

                <Icon name='check2-circle' className={f?.id === selectedId || f?.id === moveItem?.parentId ? "" : "d-none"} />
              </List.Item>
            )}
          />
        </SimpleBar>
      </Modal>
    </>
  );
}
