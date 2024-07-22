import type { ReportQuery } from '~/utils/report'

export async function getReportListUserReceiveInterest({ accountType, year }: ReportQuery) {
  const { requestAuth } = await requestAPI()
  try {
    const response = await requestAuth.raw('/reports/list-user-receive-interest', {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
      query: {
        accountType,
        year,
      },
    })
    return {
      isSuccess: true,
      response,
    }
  }
  catch (error) {
    return {
      isSuccess: false,
      error,
    }
  }
}
