import { Layout, Typography } from "antd";
import ReportingPage from "./Pages/ReportingPage";

const { Header, Content, Footer } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* header */}
      <Header
        style={{ display: "flex", alignItems: "center", background: "#001529" }}
      >
        <Typography.Title level={4} style={{ color: "#fff", margin: 0 }}>
          Early Reporting Screen
        </Typography.Title>
      </Header>

      {/* content */}
      <Content style={{ padding: 16 }}>
        <ReportingPage />
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Built with React + RTK Query + Vite
      </Footer>
    </Layout>
  );
}
