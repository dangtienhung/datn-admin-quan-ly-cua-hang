import { BarChartSimple, MonthlyRevenue } from './components'
import { CardFour, CardThree, CardTwo } from '~/components'
import { useGetAnalystQuery, useGetAnalyticsQuery } from '~/store/services'

import { CardOne } from '~/components/Cart/CardOne'
import { Loader } from '~/common'
import { Table } from 'antd'

const FeatureDashboard = () => {
  const { data: dataAnalytics, isLoading: loadingTotalMoneys, isError: errorAnalytics } = useGetAnalyticsQuery()
  const { data: dataAnalytics2, isLoading: loadingTotalMoneys2, isError: errorAnalytics2 } = useGetAnalystQuery()

  if (loadingTotalMoneys || loadingTotalMoneys2) return <Loader />

  if (errorAnalytics || errorAnalytics2) return <div>error</div>

  if (!dataAnalytics || !dataAnalytics2) return <Loader />

  const dataSaleTop = Object.values(dataAnalytics2?.TopSell.List).map((item) => {
    const keys = Object.entries(item).map((item) => {
      return item[0]
    })
    const values = Object.values(item).map((item2) => {
      return item2
    })

    const newArray = keys.map((item, index) => {
      return { ...values[index], name: item }
    })
    return newArray
  })
  const topSale = dataSaleTop[0].sort((a, b) => b.count - a.count).slice(0, 10)
  console.log(topSale)

  const columnsTopSale = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_: string, __: any, index: number) => <span className='text-gray-600'>{index + 1}</span>
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (_: string, record: any) => (
        <img src={record.images[0]} alt='' className='w-20 h-20 object-cover rounded-sm' />
      )
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => {
        // console.log('🚀 ~ file: Dashboard.tsx:39 ~ FeatureDashboard ~ record:', record)
        return <span className='text-gray-600'>{text}</span>
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
      render: (text: string) => <span className='text-gray-600'>{text}</span>
    },
    {
      title: 'Doanh thu',
      dataIndex: 'total',
      key: 'total',
      render: (_: string, record: any) => (
        <span className='text-gray-600'>{(record.price * record.count).toLocaleString()} vnđ</span>
      )
    }
  ]

  return (
    <>
      <div className='grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        <CardTwo data={dataAnalytics2?.['doanh thu tháng này']} />
        <CardOne data={dataAnalytics2?.['doanh thu tháng này']} />
        <CardThree data={dataAnalytics} />
        <CardFour data={dataAnalytics.users} />
      </div>

      <MonthlyRevenue data={dataAnalytics2} />

      <BarChartSimple data={dataAnalytics} />

      <div className='grid grid-cols-1 gap-6 mt-8'>
        {/* top 10 sản phẩm bán chạy nhất  */}
        <div className='w-full h-full rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
          <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Top 10 sản phẩm bán chạy nhất</h3>
          <Table columns={columnsTopSale} dataSource={topSale} pagination={false} />
        </div>
        <div className='hidden'>oke la</div>
      </div>

      {/* <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <VerticalBarChart />
        <GroupedBarChart />
        <DoughnutChart />
        <AreaChart />
        <ChatCard />
      </div> */}
    </>
  )
}

export default FeatureDashboard
