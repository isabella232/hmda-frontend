import { splitYearQuarter } from '../../filing/api/utils'

const defaultOpts = {
  withAdmin: true // Include administrative years (PREVIEW) in the returned list
}

// Filing Periods open for Administrative tasks via the HMDA Help UI
export const getFilingPeriods = config => {
  if (!config) return []
  return [...config.filingPeriods, ...(config.filingQuarters.PREVIEW || [])]
}


/**
 * Open Annual Filing Years
 * @param {Object} config Environment configuration
 * @param {Object} options See defaultOps for all options
 */
export const getFilingYears = (config, options = defaultOpts) => {
  let filingYears = new Set()
  const { withAdmin } = options

  const prevArry = withAdmin ? (config.filingQuarters.PREVIEW || []) : []
  let tmpFilingYears = [...config.filingPeriods, ...prevArry]
  
  // Unique
  tmpFilingYears.forEach(yr => filingYears.add(splitYearQuarter(yr)[0]))
  tmpFilingYears = []
  filingYears.forEach(yr => tmpFilingYears.push(yr))
  
  // As Ints, sorted descending
  filingYears = tmpFilingYears
    .filter((x) => x)
    .map((x) => parseInt(x, 10))
    .sort()
    .reverse()
    .map((x) => x.toString())

  return filingYears
}

/**
 * Returns the years for which Filing is open
 * @param {Object} config Environment configuration
 */
export const getOpenFilingYears = (config) => getFilingYears(config, ({ adminYears: false }))