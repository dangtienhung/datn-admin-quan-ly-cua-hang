import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useSignInMutation } from '~/store/services/Auth'
import { Login, LoginSchema } from './validate'
import { Button } from '~/components'

export default function SignIn() {
  const [loginUser] = useSignInMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Login>({
    mode: 'onChange',
    resolver: yupResolver(LoginSchema)
  })
  const onLogin = (loginData: Login) => {
    loginUser(loginData).then((data: any) => {
      if (data.error) {
        return toast.error(data.error.data.message)
      } else {
        navigate('/dashboard')
      }
    })
  }
  return (
    <div className='bg-yellow-400 dark:bg-gray-900 background-content w-full h-[100vh]   object-cover'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <Link to='/' className='flex items-center mb-6 text-2xl font-semibold text-gray-900  '>
          <img className='w-[200px]  mr-2' src='./logo.png' alt='logo' />
        </Link>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl  '>
              Sign in
            </h1>
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit(onLogin)}>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900  '>
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400   dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='name@company.com'
                  {...register('account')}
                />
                {errors.account && <span className='text-danger text-[13px] self-start'>{errors.account.message}</span>}
              </div>
              <div>
                <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900  '>
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  placeholder='••••••••'
                  className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400   dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  {...register('password')}
                />
                {errors.password?.message && (
                  <span className='text-danger text-[13px] self-start'>{errors.password?.message}</span>
                )}
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-start'>
                  <div className='flex items-center h-5'>
                    <input
                      id='remember'
                      aria-describedby='remember'
                      type='checkbox'
                      className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800'
                    />
                  </div>
                  <div className='ml-3 text-sm'>
                    <label htmlFor='remember' className='text-gray-500 dark:text-gray-300'>
                      Remember me
                    </label>
                  </div>
                </div>
                <Link to='#' className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'>
                  Forgot password?
                </Link>
              </div>
              <Button type='submit' styleClass='w-full '>
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
