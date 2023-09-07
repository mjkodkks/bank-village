import { ofetch } from 'ofetch'
export async function requestAPI() {
    const runtimeConfig = useRuntimeConfig()
    const baseURL = runtimeConfig.public.API_URL
    console.log(baseURL)
    const reuestNoneAuth = ofetch.create({
        baseURL,
        headers: {
            Accept: "application/json",
        },
        async onRequest({ request, options }) {
            // Log request
            console.log("[fetch request]", request, options);
        },
        async onResponse({ request, response, options }) {
            // Log response
            console.log("[fetch response]", request, response.status, response.body);
          },
    })

    const requestAuth = ofetch.create({
        baseURL,
        headers: {
            Accept: "application/json",
        },
        async onRequest({ request, options }) {
            // Log request
            console.log("[fetch request]", request, options);
        },
        async onResponse({ request, response, options }) {
            // Log response
            console.log("[fetch response]", request, response.status, response.body);
          },
    })

    return {
        reuestNoneAuth,
        requestAuth
    }
}