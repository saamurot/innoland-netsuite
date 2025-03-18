import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
const crypto = require('crypto');

const HOTELBEDS_BASE_URL = "https://api.test.hotelbeds.com";
const HOTELBEDS_CLIENT_ID = "531c46fc346c6729b9e9094f65abef70";
const HOTELBEDS_CLIENT_SECRET = "1e83c000f3";

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

  @Post('/CreateHotelBedSignature')
  async CreateHotelBedSignature(@Body() body) {
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `${body.clientId}${body.clientSecret}${timestamp}`;
    const hash = crypto.createHash('sha256');
    hash.update(signatureString);
    return { signature: hash.digest('hex'), timestamp: timestamp };
  }

  @Get('/GetDestinations')
  async GetDestinations() {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${HOTELBEDS_CLIENT_ID}${HOTELBEDS_CLIENT_SECRET}${timestamp}`;
      const hash = crypto.createHash('sha256');
      hash.update(signatureString);
      const signature = hash.digest('hex');
      console.log("signature", signature);
      // return { signature: hash.digest('hex'), timestamp: timestamp };

      const myHeaders = new Headers();
      myHeaders.append("Api-key", HOTELBEDS_CLIENT_ID);
      myHeaders.append("X-Signature", signature);
      myHeaders.append("Accept", "application/json");
      // Remove the Accept-Encoding header!
      // myHeaders.append("Accept-Encoding", "gzip");

      let requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        "https://api.test.hotelbeds.com/hotel-content-api/1.0/locations/destinations?fields=all&countryCodes=IN&language=ENG&from=1&to=361&useSecondaryLanguage=false",
        requestOptions
      );
      // console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      // console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/GetHotels')
  async GetHotels(@Query('destinationCode') destinationCode: any, @Query('from') from: any, @Query('to') to: any) {
    console.log({ "destinationCode": destinationCode, "from": from, "to": to });
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${HOTELBEDS_CLIENT_ID}${HOTELBEDS_CLIENT_SECRET}${timestamp}`;
      const hash = crypto.createHash('sha256');
      hash.update(signatureString);
      const signature = hash.digest('hex');
      console.log("signature", signature);
      // return { signature: hash.digest('hex'), timestamp: timestamp };

      const myHeaders = new Headers();
      myHeaders.append("Api-key", HOTELBEDS_CLIENT_ID);
      myHeaders.append("X-Signature", signature);
      myHeaders.append("Accept", "application/json");
      // Remove the Accept-Encoding header!
      // myHeaders.append("Accept-Encoding", "gzip");

      let requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels?fields=all&destinationCode=${destinationCode}&language=ENG&from=${from}&to=${to}&useSecondaryLanguage=false`,
        requestOptions
      );
      // console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      // console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/GetHotelDetails')
  async GetHotelDetails(@Query('hotelCode') hotelCode: any) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${HOTELBEDS_CLIENT_ID}${HOTELBEDS_CLIENT_SECRET}${timestamp}`;
      const hash = crypto.createHash('sha256');
      hash.update(signatureString);
      const signature = hash.digest('hex');
      console.log("signature", signature);
      // return { signature: hash.digest('hex'), timestamp: timestamp };

      const myHeaders = new Headers();
      myHeaders.append("Api-key", HOTELBEDS_CLIENT_ID);
      myHeaders.append("X-Signature", signature);
      myHeaders.append("Accept", "application/json");
      // Remove the Accept-Encoding header!
      // myHeaders.append("Accept-Encoding", "gzip");

      let requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(
        `https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels/${hotelCode}/details?language=ENG&useSecondaryLanguage=False`,
        requestOptions
      );
      // console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      // console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
}
