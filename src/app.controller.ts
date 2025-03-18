import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
const crypto = require('crypto');


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): any {
    return "Hello World!!!";
  }

  @Post('/GetPurchaseRequisition')
  getPurchaseRequisition(@Body() body) {
    console.log(body);
    return this.appService.getPurchaseRequisition(body);
  }

  @Post('/CreatePurchaseRequisition')
  async createPurchaseRequisition(@Body() body) {
    debugger
    return this.appService.createPurchaseRequisition(body);
  }

  @Post('/GetPurchaseOrder')
  getPurchaseOrder(@Body() body): any {
    return this.appService.getPurchaseOrder(body);
  }

  @Post('/CreatePurchaseOrder')
  async createPurchaseOrder(@Body() body) {
    debugger
    return this.appService.createPurchaseOrder(body);
  }

  @Post('/GetBom')
  getBom(@Body() body): any {
    return this.appService.getBom(body);
  }

  @Post('/GetWarehouseMonitoring')
  getWarehouseMonitoring(@Body() body): any {
    return this.appService.getWarehouseMonitoring(body);
  }

  @Post('/GetCostManagement')
  getCostManagement(@Body() body): any {
    return this.appService.getCostManagement(body);
  }

  @Post('/GetItemReceipt')
  getItemReceipt(@Body() body): any {
    return this.appService.getItemReceipt(body);
  }

  @Post('/GetIntercompanyTransferOrder')
  getIntercompanyTransferOrder(@Body() body): any {
    return this.appService.getIntercompanyTransferOrder(body);
  }

  @Post('/GetVendorBill')
  getVendorBill(@Body() body): any {
    return this.appService.getVendorBill(body);
  }

  @Post('/GetVendorPayment')
  getVendorPayment(@Body() body): any {
    return this.appService.getVendorPayment(body);
  }

  @Post('/GetPayables')
  getPayables(@Body() body): any {
    return this.appService.getPayables(body);
  }

  @Post('/CreateVendorBill')
  async createVendorBill(@Body() body) {
    return this.appService.createVendorBill(body);
  }

  @Post('/GetFixedAsset')
  getFixedAsset(@Body() body): any {
    return this.appService.getFixedAsset(body);
  }

  @Post('/CreateFixedAsset')
  async createFixedAsset(@Body() body) {
    return this.appService.createFixedAsset(body);
  }

  @Post('/GetOtherExpenses')
  getOtherExpenses(@Body() body): any {
    return this.appService.getOtherExpenses(body);
  }

  @Post('/GetBilling')
  getBilling(@Body() body): any {
    return this.appService.getBilling(body);
  }

  @Post('/CreateBilling')
  async createBilling(@Body() body) {
    return this.appService.createBilling(body);
  }

  @Post('/GetStripePaymentIntent')
  async GetStripePaymentIntent(@Body() body) {

    const stripe = require('stripe')(body.key);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount,
      currency: body.currency,
      payment_method_types: ['card'],
      automatic_payment_methods: {
        enabled: false,
      },
    });
    return paymentIntent;
  }

  @Post('/InitiateDragonPayPaymentUAT')
  async InitiateDragonPayPaymentUAT(@Body() body) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + body.Token
      }
    };
    let data = {
      "Amount": body.Amount,
      "Currency": "PHP",
      "Description": "digiClinic License Renewal",
      "Email": body.EmailID,
      "ProcId": ""
    };
    const res = await axios.post(`https://test.dragonpay.ph/api/collect/v2/${body.TransactionID}/post`, data, config);
    return res.data;
  }

  @Post('/InitiateDragonPayPayment')
  async InitiateDragonPayPayment(@Body() body) {
    let config = {
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Basic ' + body.Token
      }
    };
    let data = {
      "Amount": body.Amount,
      "Currency": "PHP",
      "Description": "digiClinic License Renewal",
      "Email": body.EmailID
    };
    const res = await axios.post(`https://gw.dragonpay.ph/api/collect/v1/${body.TransactionID}/post`, data, config);
    return res.data;
  }
}
