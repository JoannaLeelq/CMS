import Layout from "../../components/layout/layout";
import "antd/dist/antd.css";
import styled from "styled-components";
import { Input } from "antd";

const Search = styled(Input.Search)`
  width: 30%;
  margin-bottom: 16px;
  display: block;
`;

export default function Dashboard() {
  return (
    <Layout>
      <Search placeholder="通过名称搜索" onSearch={() => {}} />
      <div>Test</div>
    </Layout>
  );
}
