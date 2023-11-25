import { CardFour, CardThree, CardTwo } from '~/components'
import { useGetAnalystQuery, useGetAnalyticsQuery } from '~/store/services'

import { AreaChart } from '~/components/Charts'
import { BarChartSimple } from './components'
import { CardOne } from '~/components/Cart/CardOne'
import ChatCard from '~/components/Cart/ChatCart/ChatCard'
import { DoughnutChart } from '~/components/Charts/DoughnutChart'
import { GroupedBarChart } from '~/components/Charts/GroupedBarChart'
import { Loader } from '~/common'
import { VerticalBarChart } from '~/components/Charts/VerticalBarChart'

const FeatureDashboard = () => {
  const { data: dataAnalytics, isLoading: loadingTotalMoneys, isError: errorAnalytics } = useGetAnalyticsQuery()
  const { data: dataAnalytics2, isLoading: loadingTotalMoneys2, isError: errorAnalytics2 } = useGetAnalystQuery()

  if (loadingTotalMoneys || loadingTotalMoneys2) return <Loader />

  if (errorAnalytics || errorAnalytics2) return <div>error</div>

  if (!dataAnalytics || !dataAnalytics2) return <Loader />

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        <CardTwo data={dataAnalytics2?.['doanh thu tháng này']} />
        <CardOne data={dataAnalytics2?.['doanh thu tháng này']} />
        <CardThree />
        <CardFour data={dataAnalytics.users} />
      </div>

      <BarChartSimple data={dataAnalytics} />

      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <VerticalBarChart />
        <GroupedBarChart />
        <DoughnutChart />
        <AreaChart />
        {/* <div className='col-span-12 xl:col-span-8'></div> */}
        <ChatCard />
      </div>
    </>
  )
}

export default FeatureDashboard
