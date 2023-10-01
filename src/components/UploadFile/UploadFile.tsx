const UploadFile = () => {
  return (
    <div>
      <label className='mb-3 block text-black dark:text-white'>Attach file</label>
      <input
        type='file'
        className='w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white'
      />
    </div>
  )
}

export default UploadFile
