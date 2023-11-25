import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

// import * as XLSX from 'sheetjs-style'
const fileExtension = '.xlsx'

export const exportDataToExcel = (csvData: any, fileName: any) => {
  const ws = XLSX.utils.json_to_sheet(csvData)
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  })
  FileSaver.saveAs(data, fileName + fileExtension)
}

// export const exportDataToExcel = (data: any, title: string) => {
//   console.log('🚀 ~ file: exportDataToExcel.ts:17 ~ exportDataToExcel ~ data:', data)
//   const ws = XLSX.utils.aoa_to_sheet(data)
//   const wb = XLSX.utils.book_new()
//   XLSX.utils.book_append_sheet(wb, ws)
//   XLSX.writeFile(wb, `${title}.xlsx`)
// }
