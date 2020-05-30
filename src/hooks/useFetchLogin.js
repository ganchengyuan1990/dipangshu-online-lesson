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
export default function useFetchLogin({
  requestUrl = '',
  queryParams = null,
  withLoading = true,
  fetchDependence = []
}) {
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(false)

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
      ...queryParams,
      ...params
    }

    axios
      .get(requestUrl, { params: requestParams })
      .then(response => {
        setUserInfo(response.result && response.result.content)
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

  return {
    userInfo,
    setUserInfo,
    loading,
    onFetch
  }
}
