#### Ant Design causes that the Highcharts' first reflow doesn't work

The chart component need to be wrapped by Content, and Layout must have enabled hasSider property.

<Layout hasSider={true}>
  <Sider>
    ...
  </Sider>
  <Content>
    <ReactHighcharts
      highcharts={Highcharts}
      options={...}
    />
  </Content>
</Layout>,

#### Highcharts reload cause getOptions issue:

Next js executes twice: sever side and then client side; however, when the server side run, it lack window. Therefore, Highcharts loaded but not initialized.

使用 Next js Dynamic import()可以拆分代码，或针对第三方组件依赖浏览器 API 时，精致服务端渲染，设置(ssr:false)

在 dashboard/manager/下面的 index.js 使用
