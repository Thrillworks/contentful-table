import TableController from './tableController'

export const minColumns = 2
export const minRows = 2
const maxColumns = 10
const maxRows = 30

const columnsInputElem = document.getElementById(
  'columns-count'
) as HTMLInputElement
const rowsInputElem = document.getElementById('rows-count') as HTMLInputElement
const useHeaderInputElem = document.getElementById(
  'use-header'
) as HTMLInputElement
const addColumnButtonElem = document.getElementById(
  'add-column'
) as HTMLButtonElement
const removeColumnButtonElem = document.getElementById(
  'remove-column'
) as HTMLButtonElement
const addRowButtonElem = document.getElementById('add-row') as HTMLButtonElement
const removeRowButtonElem = document.getElementById(
  'remove-row'
) as HTMLButtonElement

columnsInputElem.min = minColumns.toString()
columnsInputElem.max = maxColumns.toString()
rowsInputElem.min = minRows.toString()
rowsInputElem.max = maxRows.toString()

/**
 * Keep a number with the boundaries of a minimum and maximum
 *
 * @param num value to evaluate
 * @param min minimum value boundary
 * @param max maximum value boundary
 * @returns bounded value within a min/max
 */
const calculateFromMinMax = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)

/**
 * Create all the event handles on the table element's columns/rows and
 * auxiliary settings buttons/inputs
 *
 * @param tableElem HTML table one which to add/remove columns/rows
 */
const createHandlers = (controller: TableController) => {
  /**
   * Set initial values from state
   */
  columnsInputElem.value = controller.columns.toString()
  rowsInputElem.value = controller.rows.toString()
  useHeaderInputElem.checked = controller.useHeader

  /**
   * Handle header setting toggle
   */
  useHeaderInputElem.onchange = function(ev) {
    controller.setUseHeader((<HTMLInputElement>ev.currentTarget).checked)
  }

  /**
   * Handles columns field input alter to change table column sizing
   */
  columnsInputElem.onchange = function(ev) {
    const oldValue = controller.columns
    const newValue = calculateFromMinMax(
      parseInt((<HTMLInputElement>ev.currentTarget).value, 10),
      minColumns,
      maxColumns
    )
    let commitNewValue = true
    if (oldValue < newValue) {
      const diff = newValue - oldValue
      for (var i = 0; i < diff; i++) {
        controller.addColumn()
      }
    } else if (oldValue > newValue) {
      const diff = oldValue - newValue
      for (var i = 0; i < diff; i++) {
        commitNewValue = controller.removeColumn()
      }
    }
    if (commitNewValue) {
      columnsInputElem.value = newValue.toString()
    } else {
      columnsInputElem.value = oldValue.toString()
    }
  }

  /**
   * Handles rows field input change to alter table row sizing
   */
  rowsInputElem.onchange = function(ev) {
    const oldValue = controller.rows
    const newValue = calculateFromMinMax(
      parseInt((<HTMLInputElement>ev.target).value, 10),
      minRows,
      maxRows
    )
    let commitNewValue = true
    if (oldValue < newValue) {
      const diff = newValue - oldValue
      for (var i = 0; i < diff; i++) {
        controller.addRow()
      }
    } else if (oldValue > newValue) {
      const diff = oldValue - newValue
      for (var i = 0; i < diff; i++) {
        commitNewValue = controller.removeRow()
      }
    }
    if (commitNewValue) {
      rowsInputElem.value = newValue.toString()
    } else {
      rowsInputElem.value = oldValue.toString()
    }
  }

  /**
   * Handles add column button clicks to add a new column and
   * increase columns input count by one
   */
  addColumnButtonElem.onclick = function(_ev) {
    const oldValue = controller.columns
    const newValue = calculateFromMinMax(oldValue + 1, minColumns, maxColumns)
    controller.addColumn()
    columnsInputElem.value = newValue.toString()
  }

  /**
   * Handles remove column button clicks to remove the last column
   * and decrease columns input count by one
   */
  removeColumnButtonElem.onclick = function(_ev) {
    const oldValue = controller.columns
    const newValue = calculateFromMinMax(oldValue - 1, minColumns, maxColumns)
    const deleteConfirmed = controller.removeColumn()
    if (!deleteConfirmed) return
    columnsInputElem.value = newValue.toString()
  }

  /**
   * Handles add row button clicks to add a new row and
   * increase the row input count by one
   */
  addRowButtonElem.onclick = function(_ev) {
    const oldValue = controller.rows
    const newValue = calculateFromMinMax(oldValue + 1, minRows, maxRows)
    controller.addRow()
    rowsInputElem.value = newValue.toString()
  }

  /**
   * Handles remove row button clicks to remove a new row
   * and decrease the row input count by one
   */
  removeRowButtonElem.onclick = function(_ev) {
    const oldValue = controller.rows
    const newValue = calculateFromMinMax(oldValue - 1, minRows, maxRows)
    const deleteConfirmed = controller.removeRow()
    if (!deleteConfirmed) return
    rowsInputElem.value = newValue.toString()
  }
}

export default createHandlers
