import { useEffect, useState, useCallback } from 'react'
import axios from '@/utils/axios'

import { useLocation, useHistory } from 'react-router-dom'
import { decodeQuery } from '@/utils'
import useMount from './useMount'

/**
 * fetchList
 * requestUrl 请求地址
 * queryParams 请求参数
 * withLoading 是否携带 loading
 * fetchDependence 依赖 => 可以根据地址栏解析拉取列表
 */
export default function useFetchLesson({
  requestUrl = '',
  queryParams = null,
  withLoading = true,
  fetchDependence = []
}) {
  const [dataList, setDataList] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  const location = useLocation()
  const history = useHistory()

  useMount(() => {
    if (fetchDependence.length === 0) {
      fetchWithLoading()
    }
  })

  useEffect(() => {
    if (fetchDependence.length > 0) {
      const params = decodeQuery(location.search)
      fetchWithLoading(params)
    }
  }, fetchDependence)

  function fetchWithLoading(params) {
    withLoading && setLoading(true)
    fetchDataDetail(params)
  }

  function fetchDataDetail(params) {
    const requestParams = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...queryParams,
      ...params
    }

    requestParams.page = parseInt(requestParams.page)
    requestParams.pageSize = parseInt(requestParams.pageSize)
    axios
      .get(requestUrl, { params: requestParams })
      .then(response => {
        pagination.total = response.count
        // console.log(response, 999)
        pagination.current = parseInt(requestParams.page || 0)
        pagination.pageSize = parseInt(requestParams.pageSize || 20)
        setPagination({ ...pagination })
        const content = response.result.content
        console.log(content[parseInt(queryParams.catIndex) || 0].content, 'parseInt(queryParams.catIndex)')
        setDataList(content[parseInt(queryParams.catIndex) || 0].content)
        // if (window.localStorage) {
        //   const historyData = window.localStorage.getItem('historyData')
        //   if (!historyData || historyData === '[]') {
        //     return
        //   }
        //   window.localStorage.removeItem('historyData')
        //   console.log(historyData, 'historyData')
        //   const realLessonData = JSON.parse(historyData)
        //   console.log(response.result.version, 9994)
        //   const target = realLessonData.find(item => item.id === queryParams.id && ((item.version === response.result.version) || !response.result.version))
        //   if (!target) {
        //     return target
        //   }
        //   console.log(target.dataList, response.result.version, 9995)
        //   setDataList(target.dataList)
        // }
        // console.log('%c useFetchList: ', 'background: yellow', requestParams, response)
        withLoading && setLoading(false)
      })
      .catch(e => withLoading && setLoading(false))
  }

  const onFetch = useCallback(
    params => {
      withLoading && setLoading(true)
      fetchDataDetail(params)
    },
    [queryParams]
  )

  const handlePageChange = useCallback(
    page => {
      // return
      const search = location.search.includes('page=')
        ? location.search.replace(/(page=)(\d+)/, `$1${page}`)
        : `?page=${page}`
      const jumpUrl = location.pathname + search

      history.push(jumpUrl)
    },
    [queryParams, location.pathname]
  )

  return {
    dataList,
    setDataList,
    loading,
    pagination: {
      ...pagination,
      onChange: handlePageChange
    },
    onFetch
  }
}
