import Api from '../api/AxiosInterceptors.jsx'
import { GET_SETTINGS } from '@/utils/api'

export const settingsApi = {
    getSettingsApi: requestData => {
        const { type, user_id } = requestData
        return Api.post(GET_SETTINGS, {
            type,
            user_id
        })
    }
}
