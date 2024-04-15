import Icon from "./Icon";
import { useState, useEffect, useMemo } from "react";
import { Modal, Button, Tooltip, Input, Form, Select, Radio, message } from "antd";

const { bookmarks } = window.chrome;

export default function Add({ tree, editObj = null, setEditObj, showAddBtn = tree, updateTree = () => {} }) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState({ mainFolders: [], allFolders: [] });

  const isBookmark = Form.useWatch("type", form) === "bookmark";
  const defaultParentId = useMemo(() => folders?.mainFolders?.[0]?.value, [folders]);
  const initialValues = useMemo(
    () => (editObj ? { ...editObj } : { type: "bookmark", title: "", url: "", parentId: defaultParentId }),
    [editObj, defaultParentId]
  );

  const getWithChildrenCount = (tree) => tree?.map((t) => ({ ...t, value: t?.id, label: `${t?.title} (${t?.children?.length})` }));

  useEffect(() => {
    const mainFolders = getWithChildrenCount(tree);
    const allFolders = mainFolders.reduce((arr, { children = [] }) => {
      if (children?.length === 0) return arr;

      return [...arr, ...getWithChildrenCount(children?.filter((c) => c?.children))];
    }, mainFolders);

    setFolders((prev) => ({ ...prev, mainFolders, allFolders }));

    if (editObj) form.setFieldsValue({ ...editObj });

    return () => form.resetFields();
  }, [tree, editObj]);

  // Create Bookmark/Folder
  const onFinish = ({ title, url, parentId }) => {
    const data = { title, parentId };
    if (isBookmark) data.url = url;

    const callback = () => {
      updateTree();
      setOpen(false);
      form.resetFields();
      setEditObj && setEditObj(null);
      message.success(`${isBookmark ? "Bookmark" : "Folder"} ${editObj ? "updated" : "created"} successfully`);
    };

    if (editObj) {
      delete data.parentId; // parentId is not required for update

      bookmarks.update(editObj.id, data, callback);
    } else bookmarks.create(data, callback);
  };

  return (
    <>
      {showAddBtn && (
        <Tooltip title='Add New'>
          <Button type='text' shape='circle' icon={<Icon name='plus-circle' />} onClick={() => setOpen(true)} />
        </Tooltip>
      )}

      <Modal
        footer={null}
        destroyOnClose
        open={open || editObj !== null}
        onCancel={() => {
          setOpen(false);
          setEditObj && setEditObj(null);
        }}
        styles={{ content: { padding: 16 } }}
        title={`${editObj ? "Update" : "Create"} Bookmark/Folder`}
        afterOpenChange={(isOpen) => isOpen && document.querySelector("#title")?.focus()}
      >
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={initialValues}
          onValuesChange={({ type }, values) => {
            if (type === "folder" && !folders?.mainFolders?.map((f) => f.value).includes(values?.parentId)) {
              form.setFieldsValue({ parentId: defaultParentId });
            }
          }}
        >
          <Form.Item name='type' label='Type' className='mb-2'>
            <Radio.Group
              optionType='button'
              buttonStyle='solid'
              disabled={editObj !== null}
              options={[
                {
                  value: "bookmark",
                  label: (
                    <div className='flex-item gap-1'>
                      <Icon name='bookmark' /> Bookmark
                    </div>
                  ),
                },
                {
                  value: "folder",
                  label: (
                    <div className='flex-item gap-1'>
                      <Icon name='folder' /> Folder
                    </div>
                  ),
                },
              ]}
            />
          </Form.Item>

          <Form.Item name='title' label='Title' className='mb-2' rules={[{ required: true }]}>
            <Input autoFocus placeholder='Title' prefix={<Icon name='pencil' />} />
          </Form.Item>

          {isBookmark && (
            <Form.Item name='url' label='URL' className='mb-2' rules={[{ required: true }, { type: "url" }]}>
              <Input type='url' placeholder='URL' prefix={<Icon name='globe' />} />
            </Form.Item>
          )}

          {!editObj && (
            <Form.Item name='parentId' label='Parent Folder' className='mb-2'>
              <Select placeholder='Parent Folder' options={isBookmark ? folders?.allFolders : folders?.mainFolders} />
            </Form.Item>
          )}

          <Form.Item noStyle>
            <Button type='primary' htmlType='submit'>
              {editObj ? "Update" : "Create"} {isBookmark ? "Bookmark" : "Folder"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
