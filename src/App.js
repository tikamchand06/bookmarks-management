import logo from "./logo.png";
import All from "./components/All";
import Add from "./components/Add";
import Icon from "./components/Icon";
import Recent from "./components/Recent";
import Search from "./components/Search";
import React, { useState, useEffect } from "react";
import { Layout, Image, Tabs, Typography, Button } from "antd";

const { Link } = Typography;
const { bookmarks } = window.chrome;
const { Header, Content, Footer } = Layout;

export default function App() {
  const [tree, setTree] = useState([]);

  const updateTree = () => bookmarks.getTree((tree) => setTree(tree[0]?.children || []));

  const itmes = [
    { key: "all", label: "All", icon: <Icon name='bookmarks' />, children: <All tree={tree} updateTree={updateTree} /> },
    { key: "recent", label: "Recent", icon: <Icon name='arrow-clockwise' />, children: <Recent /> },
  ];

  useEffect(() => {
    updateTree();
  }, []);

  return (
    <Layout>
      <Header className='p-10px bg-white h-auto lh-auto flex-item space-between'>
        <Image src={logo} preview={false} className='h-42px' />
        <Button type='primary' target='_blank' href='https://admin.tcmhack.in'>
          Contact Me
        </Button>
      </Header>

      <Content className='bg-white' style={{ height: "calc(100vh - 104px)" }}>
        <Tabs
          items={itmes}
          animated={true}
          defaultActiveKey='all'
          tabBarStyle={{
            top: 0,
            margin: 0,
            zIndex: 11,
            padding: "0 10px",
            background: "#fff",
            position: "sticky",
            boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          }}
          tabBarExtraContent={{
            right: (
              <div className='flex-item gap-1'>
                <Add tree={tree} updateTree={updateTree} />
                <Search />
              </div>
            ),
          }}
        />
      </Content>

      <Footer className='p-10px bg-212121 color-ffffff flex-item gap-5px'>
        <Icon name='c-circle' height={14} width={14} />
        {new Date().getFullYear()} Developed by
        <Link href='https://www.tcmhack.in' target='_blank'>
          https://www.tcmhack.in
        </Link>
      </Footer>
    </Layout>
  );
}
