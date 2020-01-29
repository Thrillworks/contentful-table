import { init as initContentfulExtension } from 'contentful-ui-extensions-sdk'
// window.startAutoResizer() ?

import TableController from './tableController'
import createHandlers, { minColumns, minRows } from './eventHandlers'
import { createMockExtension, getInitialTableData, Extension } from './utils'

const contentElem = document.getElementById('table-extension-content')
const tableElem = contentElem.querySelector('table')

/**
 * Handles Contentful UI extension creation with initial values (if any)
 * and create the table contents dynamically based on our defaults passed
 * to `getInitialData`
 *
 * @param extension From Contentful API in order to handle data
 */
const handleInitialization = (extension?: Extension) => {
  let value = extension.field.getValue()
  // reset array if data corrupt
  if (
    value &&
    value.tableData &&
    !Array.isArray(value.tableData) &&
    !Array.isArray(value.tableData[0])
  ) {
    value = undefined
  }

  if (!value) {
    /**
     * Default table values
     */
    value = {
      useHeader: true,
      tableData: getInitialTableData({
        columns: minColumns,
        rows: minRows,
      }),
    }
  }

  const tableController = new TableController({
    table: tableElem,
    state: value,
    db: extension.field,
  })

  createHandlers(tableController)
}

if (process.env.NODE_ENV === 'production') {
  try {
    initContentfulExtension(handleInitialization)
  } catch (err) {
    console.error(err)
    contentElem.innerHTML = `
      <div>
        <h1>
          Error
        </h1>
        <p>
          We encountered an error with the Table Contentful UI Extension.
        </p>
      </div>
    `
  }
} else {
  const mockExtension = createMockExtension()
  handleInitialization(mockExtension)
}
