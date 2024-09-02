import { expect } from "@playwright/test"

export class PaymentPage {
    constructor(page) {
        this.page = page

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]')
        this.discountInput = page.getByPlaceholder('Discount code')
        this.activateDiscountButton = page.locator('[data-qa="submit-discount-button"]')
        this.totalValue = page.locator('[data-qa="total-value"]')
        this.discountedValue = page.locator('[data-qa="total-with-discount-value"]')
        this.discountActiveMessage = page.locator('[data-qa="discount-active-message"]')
        this.creidtCardOwnerInput = page.getByPlaceholder("Credit card owner")
        this.creidtCardNumberInput = page.getByPlaceholder("Credit card number")
        this.creidtCardValidUntilInput = page.getByPlaceholder("Valid until")
        this.creidtCardCvcInput = page.getByPlaceholder("Credit card CVC")
        this.payButton = page.locator('[data-qa="pay-button"]')

    }

    activateDiscount = async () => {
        await this.discountCode.waitFor()
        const code = await this.discountCode.innerText()
        await this.discountInput.waitFor()
        await this.discountInput.fill(code)
        await expect(this.discountInput).toHaveValue(code)
       // await this.page.pause()

       /* await this.discountInput.focus()
       await this.page.keyboard.type(code, { delay: 1000 })
       expect(await this.discountInput.inputValue()).toBe(code) */
       
       expect(await this.discountedValue.isVisible()).toBe(false)
       expect(await this.discountActiveMessage.isVisible()).toBe(false)
       await this.activateDiscountButton.waitFor()
       await this.activateDiscountButton.click()
       await this.discountActiveMessage.waitFor()

       await this.discountedValue.waitFor()
       const discountValueText = await this.discountedValue.innerText()
       const discountValueOnlyStringNumber = discountValueText.replace("$", "")
       const discountValueNumber = parseInt(discountValueOnlyStringNumber, 10)

       await this.totalValue.waitFor()
       const totalValueText = await this.totalValue.innerText()
       const totalValueOnlyStringNumber = totalValueText.replace("$", "")
       const totalValueNumber =parseInt(totalValueOnlyStringNumber, 10)
       expect(discountValueNumber).toBeLessThan(totalValueNumber)
    }

    fillPaymentDetails = async (paymentDetails) => {
        await this.creidtCardOwnerInput.waitFor()
        await this.creidtCardOwnerInput.fill(paymentDetails.owner)
        await this.creidtCardNumberInput.waitFor()
        await this.creidtCardNumberInput.fill(paymentDetails.number)
        await this.creidtCardValidUntilInput.waitFor()
        await this.creidtCardValidUntilInput.fill(paymentDetails.validUntil)
        await this.creidtCardCvcInput.waitFor()
        await this.creidtCardCvcInput.fill(paymentDetails.cvc)
    }

    completePayment = async () => {
        await this.payButton.waitFor()
        await this.payButton.click()
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 })
    }
}