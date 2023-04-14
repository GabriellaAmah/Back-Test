import * as axios from "axios";
import { PAYSTACK_SECRET_KEY, PAYSTACK_BASE_URL } from "../../config"

export class PayStackIntegrationService {
    private axiosManager: any

    constructor({
        axiosManager = axios
    } = {}) {
        this.axiosManager = axiosManager
    }

    async resolveBankAccountDetails(account_number: number, bank_code: string): Promise<any> {
        try {
            const url = `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`
            const response = await this.axiosManager.get(url, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            })

            return response.data
        } catch (error) {
            return error
        }
    }
}
