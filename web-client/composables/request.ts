import Cookies from 'js-cookie'
import { ofetch } from 'ofetch'

export function requestAPI() {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.API_URL

  const reuestNoneAuth = ofetch.create({
    baseURL,
    headers: {
      Accept: 'application/json',
    },
    async onRequest({ request, options }) {
      // Log request
      // console.log("[fetch request]", request, options);
    },
    async onResponse({ request, response, options }) {
      // Log response
      // console.log("[fetch response]", request, response.status, response.body);
      console.log(response);
      console.log(Array.from(response.headers.keys()));
      
    },
  })

  const requestAuth = ofetch.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${Cookies.get('accessToken')}` || '',
    },
    async onRequest({ request, options }) {
      // Log request
      // console.log("[fetch request]", request, options);
    },
    async onResponse({ request, response, options }) {
      // Log response
      // console.log("[fetch response]", request, response.status, response.body);
    },
  })

  return {
    reuestNoneAuth,
    requestAuth,
  }
}
