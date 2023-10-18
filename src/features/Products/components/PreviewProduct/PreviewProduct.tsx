import { Drawer } from 'antd'
import { memo } from 'react'

interface PreviewProductProps {
  open: boolean
  onClose: () => void
}

const PreviewProduct = ({ onClose, open }: PreviewProductProps) => {
  return (
    <Drawer title='Basic Drawer' placement='right' onClose={onClose} open={open}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  )
}

export default PreviewProduct

{
  /* <div className='flex gap-4'>
          <div className='w-[40%]'>
            <Slider {...settings}>
              {product.images.map((url) => (
                <div key={url.url}>
                  <img src={url.url} alt={product.name} className='w-full' />
                </div>
              ))}
            </Slider>
          </div>
          <div className='flex-1'>
            <div className='flex flex-col'>
              <h1 className='flex flex-wrap items-center gap-2 text-2xl font-bold capitalize'>
                <span className='text-2xl font-bold'>{product.name}</span>{' '}
                {product.sale && (
                  <span className='flex items-center text-2xl font-bold'>
                    <span className='mt-[2px] mr-3'>
                      <BiSolidDiscount />
                    </span>
                    <span className=''>{saleCaculator(product.sale)}</span>
                  </span>
                )}
              </h1>
              <span className=''>
                {product.category?.name} -
                {`Sale: ${product.sale.isPercent ? product.sale.value + '%' : formatCurrency(product.sale.value)}`}
              </span>
              <div className='mt-5'>
                <h2 className='text-lg font-semibold'>Description</h2>
                <span className=''>{parse(product.description)}</span>
              </div>
              <div className='mt-14 relative'>
                <div className='absolute -top-4 left-0 w-full bg-gray-200 h-[1px] z-10'></div>
                <div className='-top-8 left-4 absolute z-10 px-4 bg-white'>
                  <h2 className='text-lg font-semibold'>Size</h2>
                </div>
                <Table
                  dataSource={sizes.map((item) => ({ ...item, key: uuidv4() }))}
                  columns={columns}
                  pagination={false}
                />
              </div>
              <div className='mt-14 relative'>
                <div className='absolute -top-4 left-0 w-full bg-gray-200 h-[1px] z-10'></div>
                <div className='-top-8 left-4 absolute z-10 px-4 bg-white'>
                  <h2 className='text-lg font-semibold'>Topping</h2>
                </div>
                <Table
                  dataSource={product.toppings.map((item) => ({ ...item, key: uuidv4() }))}
                  columns={columns}
                  pagination={false}
                />
              </div>
            </div>
          </div>
        </div> */
}
