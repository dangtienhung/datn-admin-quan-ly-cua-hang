import { CardFour, CardThree, CardTwo } from '~/components'

import { AreaChart } from '~/components/Charts'
import { CardOne } from '~/components/Cart/CardOne'
import ChatCard from '~/components/Cart/ChatCart/ChatCard'
import { DoughnutChart } from '~/components/Charts/DoughnutChart'
import { GroupedBarChart } from '~/components/Charts/GroupedBarChart'
import { VerticalBarChart } from '~/components/Charts/VerticalBarChart'

const FeatureDashboard = () => {
  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

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
