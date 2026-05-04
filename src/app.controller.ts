import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
const crypto = require('crypto');
import { Response } from 'express';
import * as pdf from 'html-pdf-node';


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

  @Post('downloadPdf')
  async downloadPdf(@Body() body, @Res() res: Response) {
    const file = { content: body.html };
    const options = {
      format: 'A4',
      landscape: body?.type == 'l' ? true : false,
      printBackground: true,
      displayHeaderFooter: false,
      footerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; padding: 10px;">
          <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `,
      headerTemplate: `<div></div>`, // Empty header if not needed
      margin: {
        top: '25px',
        bottom: '25px',
        right: '25px',
        left: '25px'
      }
    };

    try {
      const buffer = await pdf.generatePdf(file, options);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
      res.end(buffer);
    } catch (err) {
      console.error('PDF generation failed:', err);
      res.status(500).send('Failed to generate PDF');
    }
  }

}
