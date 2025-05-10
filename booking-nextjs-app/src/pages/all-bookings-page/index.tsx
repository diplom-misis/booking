import Layout from '../layout';

export default function AllBookingsPage() {
  return (
    <Layout>
      <div className='flex flex-col justify-self-center gap-6'>
        <h2 className='text-3xl font-bold text-gray-800'>
          Ваши бронирования
        </h2>
        <div className='flex flex-col gap-5'></div>
      </div>
    </Layout>
  )
}